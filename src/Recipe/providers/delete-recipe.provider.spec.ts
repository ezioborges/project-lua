import { Test, TestingModule } from '@nestjs/testing';
import { DeleteRecipeProvider } from './delete-recipe.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Recipe } from '../entities/recipe.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('DeleteRecipeProvider', () => {
  let provider: DeleteRecipeProvider;

  const mockRecipeRepository = {
    findOneBy: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteRecipeProvider,
        {
          provide: getRepositoryToken(Recipe),
          useValue: mockRecipeRepository,
        },
      ],
    }).compile();

    provider = module.get<DeleteRecipeProvider>(DeleteRecipeProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('O provider DeleteRecipeProvider deve estar definido', () => {
    expect(provider).toBeDefined();
  });

  it('Deve ser possível deletar uma receita', async () => {
    // 1. Arrange
    const recipeId = '123';
    const mockRecipe = { id: recipeId, name: 'shampoo' };

    // O retorno padrão do softDelete no TypeORM é um UpdateResult
    const mockDeleteResult = {
      affected: 1,
      raw: [],
      generatedMaps: [],
    };

    // Simular que a receita foi encontrada
    mockRecipeRepository.findOneBy.mockResolvedValue(mockRecipe);

    // Simula que a deleção foi um sucesso
    mockRecipeRepository.softDelete.mockResolvedValue(mockDeleteResult);

    // 2. Act
    const result = await provider.execute(recipeId);

    // 3. Assert
    expect(mockRecipeRepository.findOneBy).toHaveBeenCalledWith({
      id: recipeId,
    });
    expect(mockRecipeRepository.softDelete).toHaveBeenCalledWith(recipeId);
    expect(result).toEqual(mockDeleteResult);
  });

  it('Deve lançar NotFoundException se a receita não for encontrada', async () => {
    // Arrange
    const recipeId = '123';

    mockRecipeRepository.findOneBy.mockResolvedValue(null);

    // Act & Assert
    const errorMessage = new RegExp(
      `Nenhuma receita encontrada com o ID: ${recipeId}`,
      'i',
    );

    expect(provider.execute(recipeId)).rejects.toThrow(NotFoundException);
    expect(provider.execute(recipeId)).rejects.toThrow(errorMessage);

    // Garante que o método de delete não foi chamado
    expect(mockRecipeRepository.softDelete).not.toHaveBeenCalled();
  });

  it('Deve lançar InternalServerException em caso de erro no banco de dados', async () => {
    // Arrage
    const recipeId = '123';

    // Simula que o erro aconteceu
    mockRecipeRepository.findOneBy.mockRejectedValue(
      new Error('Falha de conexão'),
    );

    // Act & Assert
    const errorMessage = new RegExp(
      `Erro ao deletar receita: falha de conexão`,
      'i',
    );

    await expect(provider.execute(recipeId)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(provider.execute(recipeId)).rejects.toThrow(errorMessage);

    expect(mockRecipeRepository.findOneBy).toHaveBeenCalled();
    expect(mockRecipeRepository.softDelete).not.toHaveBeenCalled();
  });
});
