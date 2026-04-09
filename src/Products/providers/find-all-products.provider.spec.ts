import { Test, TestingModule } from '@nestjs/testing';
import { FindAllProductsProvider } from './find-all-products.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('FindAllProductsProvider', () => {
  let provider: FindAllProductsProvider;

  const mockProductRepository = {
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllProductsProvider,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    provider = module.get<FindAllProductsProvider>(FindAllProductsProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('O provider de FindAllProductsProvider deve estar definido', async () => {
    expect(provider).toBeDefined();
  });

  it('Deve listar todos os produtos usando paginação e limite', async () => {
    const mockProducts = [
      {
        id: '1',
        name: 'product 1',
        price: 10.0,
        sku: 'SKU-001',
        stock_quantity: 3,
        categoryId: '123',
      },
      {
        id: '2',
        name: 'product 2',
        price: 10.0,
        sku: 'SKU-002',
        stock_quantity: 3,
        categoryId: '123',
      },
    ];

    const mockTotal = 2;

    mockProductRepository.findAndCount.mockResolvedValue([
      mockProducts,
      mockTotal,
    ]);

    const result = await provider.execute();

    expect(mockProductRepository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 10,
        skip: 0,
      }),
    );

    expect(result).toEqual({
      products: mockProducts,
      meta: {
        total: mockTotal,
        page: 1,
        lastPage: 1,
      },
    });
  });

  it('Deve calcular corretamente o skip e a lastPage para paginação customizada', async () => {
    const mockProduct = [
      {
        id: '2',
        name: 'product 2',
        price: 10.0,
        sku: 'SKU-002',
        stock_quantity: 3,
        categoryId: '123',
      },
    ];
    const mockTotal = 12;

    mockProductRepository.findAndCount.mockResolvedValue([
      mockProduct,
      mockTotal,
    ]);

    const result = await provider.execute(2, 5);

    expect(mockProductRepository.findAndCount).toHaveBeenCalledWith(
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

  it('Deve lançar o erro InternalServerException', async () => {
    const errorTest = new Error(`Falha na conexão`);
    mockProductRepository.findAndCount.mockRejectedValue(errorTest);

    const errorMessage = new RegExp(
      `Não foi possível listar os produtos: ${errorTest.message}`,
      'i',
    );

    await expect(provider.execute()).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(provider.execute()).rejects.toThrow(errorMessage);
  });
});
