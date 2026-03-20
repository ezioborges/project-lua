import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Recipe } from '../entities/recipe.entity';
import { FindAllRecipesProvider } from './find-all-recipes.provider';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('FindAllRecipesProvider', () => {
  let provider: FindAllRecipesProvider;

  const mockRecipeRepository = {
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllRecipesProvider,
        {
          provide: getRepositoryToken(Recipe),
          useValue: mockRecipeRepository,
        },
      ],
    }).compile();

    provider = module.get<FindAllRecipesProvider>(FindAllRecipesProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('O provider FindAllRecipesProvider deve estar definido', async () => {
    expect(provider).toBeDefined();
  });

  it('Deve retornar receitas e metadados usando paginação e limite', async () => {
    // Arrange
    const mockRecipes = [
      { id: '1', name: 'shampoo' },
      { id: '2', name: 'sobone' },
    ];
    const mockTotal = 2;

    mockRecipeRepository.findAndCount.mockResolvedValue([
      mockRecipes,
      mockTotal,
    ]);

    // Como não foi passado nenhum padrão ele calcula com os valores padrão
    // page = 1 e limit = 10
    const result = await provider.execute();

    // Assert
    // Verificar se ele calculou o skip está correto
    expect(mockRecipeRepository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 10,
        skip: 0, // (page - 1) * limit
      }),
    );

    expect(result).toEqual({
      recipes: mockRecipes,
      meta: {
        total: mockTotal,
        page: 1,
        lastPage: 1, // Math.ceil(2 / 10) = 1
      },
    });
  });

  it('Deve calcular corretamente o skip e a lastPage para paginação customizada', async () => {
    // Arrege
    const mockRecipes = [{ id: '3', name: 'shampoo' }];
    const mockTotal = 12; // simulando que tem mais receitas que o limite da page

    mockRecipeRepository.findAndCount.mockResolvedValue([
      mockRecipes,
      mockTotal,
    ]);

    // Act
    const result = await provider.execute(2, 5); // page = 2 e limit = 5

    // Assert
    expect(mockRecipeRepository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 5,
        skip: 5, // skip = (2 - 1) * 5 = 1 * 5
      }),
    );

    expect(result.meta).toEqual({
      total: 12,
      page: 2,
      lastPage: 3, // Math.ceil(12 / 5) = 3 // ceil retorna o número mais alto seguinte
    });
  });

  it('Deve lançar NotFoundException se nenhuma receita for encontrada', async () => {
    // Arrange
    mockRecipeRepository.findAndCount.mockResolvedValue([[], 0]);

    // Act & assert
    const errorMessage = new RegExp(`Nenhuma receita foi encontrada`);

    await expect(provider.execute()).rejects.toThrow(NotFoundException);
    await expect(provider.execute()).rejects.toThrow(errorMessage);
  });

  it('Deve lançar InternalServerErrorExceptio se o banco falhar', async () => {
    // Arrege
    mockRecipeRepository.findAndCount.mockRejectedValue(
      new Error('Falha de conexão'),
    );

    // Act & Assert
    const errorMessage = new RegExp(`Não foi possível listar as receitas`, 'i');

    await expect(provider.execute()).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(provider.execute()).rejects.toThrow(errorMessage);
  });
});
