import { Test, TestingModule } from '@nestjs/testing';
import { FindAllIngredientsProvider } from './find-all-ingredients.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('FindAllIngredientsProvider', () => {
  let provider: FindAllIngredientsProvider;

  const mockIngredientRepository = {
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllIngredientsProvider,
        {
          provide: getRepositoryToken(Ingredient),
          useValue: mockIngredientRepository,
        },
      ],
    }).compile();

    provider = module.get<FindAllIngredientsProvider>(
      FindAllIngredientsProvider,
    );
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('Testas e o provider de FindAllIngredientsProvider deve estar definido', async () => {
    expect(provider).toBeDefined();
  });

  it('Deve listar todos os ingredientes usando paginação e limite', async () => {
    const mockIngredients = [
      { id: '1', name: 'ingrediente 1' },
      { id: '2', name: 'ingrediente 2' },
    ];

    const mockTotal = 2;

    mockIngredientRepository.findAndCount.mockResolvedValue([
      mockIngredients,
      mockTotal,
    ]);

    const result = await provider.execute();

    expect(mockIngredientRepository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 10,
        skip: 0,
      }),
    );

    expect(result).toEqual({
      ingredients: mockIngredients,
      meta: {
        total: mockTotal,
        page: 1,
        lastPage: 1,
      },
    });
  });

  it('Deve calculaer corretamente o skip e a lastPage para paginação customizada', async () => {
    const mockIngredients = [{ id: '1', name: 'shampoo' }];
    const mockTotal = 12;

    mockIngredientRepository.findAndCount.mockResolvedValue([
      mockIngredients,
      mockTotal,
    ]);

    const result = await provider.execute(2, 5);

    expect(mockIngredientRepository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 5,
        skip: 5,
      }),
    );

    expect(result.meta).toEqual({
      total: mockTotal,
      page: 2,
      lastPage: 3,
    });
  });

  it('Deve retornar NotFoundException se nenhuma categoria for encontrada', async () => {
    mockIngredientRepository.findAndCount.mockResolvedValue([[], 0]);

    const errorMessage = new RegExp(
      `Não foi possível listar os ingredientes`,
      'i',
    );

    await expect(provider.execute()).rejects.toThrow(NotFoundException);
    await expect(provider.execute()).rejects.toThrow(errorMessage);
  });

  it('Deve lançar o erro InternalServerException', async () => {
    const errorTest = new Error(`Falha na conexão`);
    mockIngredientRepository.findAndCount.mockRejectedValue(errorTest);

    const errorMessage = new RegExp(
      `Erro ao listar ingredientes: ${errorTest.message}`,
      'i',
    );

    await expect(provider.execute()).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(provider.execute()).rejects.toThrow(errorMessage);
  });
});
