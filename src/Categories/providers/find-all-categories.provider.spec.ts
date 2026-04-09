import { Test, TestingModule } from '@nestjs/testing';
import { FindAllCategoriesProvider } from './find-all-categories.provider';
import { Category } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoryValidator } from '../services/categories-validators.service';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('FindAllCategoriesProvider', () => {
  let provider: FindAllCategoriesProvider;

  const mockCategoryRepository = {
    findAndCount: jest.fn(),
  };

  const mockCategoryValidator = {
    checkCategoryListExist: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllCategoriesProvider,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
        {
          provide: CategoryValidator,
          useValue: mockCategoryValidator,
        },
      ],
    }).compile();

    provider = module.get<FindAllCategoriesProvider>(FindAllCategoriesProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('Testas e o provider de FindAllCategoriesProvider deve estar definido', async () => {
    expect(provider).toBeDefined();
  });

  it('Deve listar todas as categorias usando paginação e limite', async () => {
    const mockCategories = [
      { id: '1', name: 'shampoo' },
      { id: '2', name: 'sabonete' },
    ];

    const mockTotal = 2;

    mockCategoryRepository.findAndCount.mockResolvedValue([
      mockCategories,
      mockTotal,
    ]);

    const result = await provider.execute();

    expect(mockCategoryRepository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 10,
        skip: 0,
      }),
    );

    expect(result).toEqual({
      categories: mockCategories,
      meta: {
        total: mockTotal,
        page: 1,
        lastPage: 1,
      },
    });
  });

  it('Deve calculaer corretamente o skip e a lastPage para paginação customizada', async () => {
    const mockCategories = [{ id: '1', name: 'shampoo' }];
    const mockTotal = 12;

    mockCategoryRepository.findAndCount.mockResolvedValue([
      mockCategories,
      mockTotal,
    ]);

    const result = await provider.execute(2, 5);

    expect(mockCategoryRepository.findAndCount).toHaveBeenCalledWith(
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
    // Aqui eu preciso resolver o mock para que não pule direto para o catch
    mockCategoryRepository.findAndCount.mockResolvedValue([[], 0]);

    // Lanço o erro no validador das categorias
    mockCategoryValidator.checkCategoryListExist.mockRejectedValue(
      new NotFoundException(`Nenhuma categoria encontrada`),
    );

    const errorMessage = new RegExp(`Nenhuma categoria encontrada`);

    await expect(provider.execute()).rejects.toThrow(NotFoundException);
    await expect(provider.execute()).rejects.toThrow(errorMessage);
  });

  it('Deve lançar o erro InternalServerException', async () => {
    const errorTest = new Error(`Falha na conexão`);
    mockCategoryRepository.findAndCount.mockRejectedValue(errorTest);

    const errorMessage = new RegExp(
      `Erro ao buscar todas as categorias: ${errorTest.message}`,
      'i',
    );

    await expect(provider.execute()).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(provider.execute()).rejects.toThrow(errorMessage);
  });
});
