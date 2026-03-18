import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { FindRecipeByIdProvider } from './find-recipe-by-id.provider';
import { Recipe } from '../entities/recipe.entity';

describe('FindRecipeByIdProvider', () => {
  let provider: FindRecipeByIdProvider;

  // Criamos o nosso repositório falso (mock)
  const mockRecipeRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindRecipeByIdProvider,
        {
          provide: getRepositoryToken(Recipe),
          useValue: mockRecipeRepository, // Injetamos o falso no lugar do banco real
        },
      ],
    }).compile();

    provider = module.get<FindRecipeByIdProvider>(FindRecipeByIdProvider);
  });

  // Limpamos o histórico do mock antes de cada teste
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(provider).toBeDefined();
  });

  it('deve retornar uma receita quando ela for encontrada', async () => {
    const receitaFalsa = { id: '123', name: 'Shampoo Base' };

    // Configuramos o mock para retornar a receita falsa
    mockRecipeRepository.findOne.mockResolvedValue(receitaFalsa);

    const resultado = await provider.execute('123');

    // Verificamos se o provider retornou o que o mock entregou
    expect(resultado).toEqual(receitaFalsa);
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
});
