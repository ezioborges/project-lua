import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { FindRecipeByIdProvider } from './find-recipe-by-id.provider';
import { Recipe } from '../entities/recipe.entity';

describe('FindRecipeByIdProvider', () => {
  let provider: FindRecipeByIdProvider;

  // Cria o mock (repositório fake)
  const mockRecipeRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindRecipeByIdProvider,
        {
          provide: getRepositoryToken(Recipe),
          useValue: mockRecipeRepository, // Injeta o mock no lugar do banco de dados
        },
      ],
    }).compile();

    provider = module.get<FindRecipeByIdProvider>(FindRecipeByIdProvider);
  });

  // Limpa o histórico dos mocks
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(provider).toBeDefined();
  });

  it('deve retornar uma receita quando ela for encontrada', async () => {
    const fakeRecipe = { id: '123', name: 'Shampoo Base' };

    // Configuramos o mock para retornar a receita falsa
    mockRecipeRepository.findOne.mockResolvedValue(fakeRecipe);

    const resultado = await provider.execute('123');

    // Verificamos se o provider retornou o que o mock entregou
    expect(resultado).toEqual(fakeRecipe);
    expect(mockRecipeRepository.findOne).toHaveBeenCalledTimes(1);
  });

  it('deve lançar um erro NotFoundException se a receita não existir', async () => {
    // Configuramos o mock para não retornar nada
    mockRecipeRepository.findOne.mockResolvedValue(null);

    // Verificamos se o erro correto é lançado
    await expect(provider.execute('id-inexistente')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Deve lançar InternalServerErrorException caso ocorra erro no banco de dados', async () => {
    // Arrage
    mockRecipeRepository.findOne.mockRejectedValue(
      new Error('Erro de conexão'),
    );

    // Act & Assert
    const errorMessage = new RegExp(
      `Não foi possível encontrar a receita pelo ID.`,
      'i',
    );

    await expect(provider.execute('123')).rejects.toThrow(errorMessage);
  });
});
