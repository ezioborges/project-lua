import { Test, TestingModule } from '@nestjs/testing';
import { FindIngredientByIdProvider } from './find-ingredient-by-id.provider';
import { Ingredient } from '../entities/ingredient.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('FindIngredientByIdProvider', () => {
  let provider: FindIngredientByIdProvider;

  const mockIngredientRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindIngredientByIdProvider,
        {
          provide: getRepositoryToken(Ingredient),
          useValue: mockIngredientRepository,
        },
      ],
    }).compile();

    provider = module.get<FindIngredientByIdProvider>(
      FindIngredientByIdProvider,
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('o provider deve FindCategoryByIdProvider deve estar definido', async () => {
    expect(provider).toBeDefined();
  });

  it('Deve retornar o ingrediente correto através do ID', async () => {
    const ingredientId = '123';
    const ingredient = { id: ingredientId, name: 'shampoo' };

    mockIngredientRepository.findOneBy.mockResolvedValue(ingredient);

    const result = await provider.execute(ingredientId);

    expect(result).toEqual(ingredient);
    expect(mockIngredientRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockIngredientRepository.findOneBy).toHaveBeenCalledWith({
      id: ingredientId,
    });
  });

  it('Deve lançar um erro NotFoundException se o ingrediente não existir', async () => {
    mockIngredientRepository.findOneBy.mockResolvedValue(null);

    const errorMessage = new RegExp(
      `Não foi possível encontrar o ingredient com o ID: id-inexistente`,
    );

    await expect(provider.execute('id-inexistente')).rejects.toThrow(
      NotFoundException,
    );

    await expect(provider.execute('id-inexistente')).rejects.toThrow(
      errorMessage,
    );
  });

  it('Deve lançar InternalServerException caso ocorra erro no banco de dados', async () => {
    const errorContent = new Error('Erro de conexão');

    mockIngredientRepository.findOneBy.mockRejectedValue(errorContent);

    const errorMessage = new RegExp(
      `Erro na busca do ingrediente através do ID: ${errorContent.message}`,
    );

    expect(provider.execute('123')).rejects.toThrow(errorMessage);
    expect(provider.execute('123')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
