import { Test, TestingModule } from '@nestjs/testing';
import { FindProductByIdProvider } from './find-product-by-id.provider';
import { Product } from '../entities/products.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('FindProductByIdProvider', () => {
  let provider: FindProductByIdProvider;

  const mockProductRespository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindProductByIdProvider,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRespository,
        },
      ],
    }).compile();

    provider = module.get<FindProductByIdProvider>(FindProductByIdProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('o provider FindProductByIdProvider deve estar definido', async () => {
    expect(provider).toBeDefined();
  });

  it('Deve retornar o ingrediente correto através do ID', async () => {
    const productId = '123';

    const mockProduct = {
      id: productId,
      name: 'product 1',
      price: 10.0,
      sku: 'SKU-001',
      stock_quantity: 3,
      categoryId: '123',
    };

    mockProductRespository.findOneBy.mockResolvedValue(mockProduct);

    const result = await provider.execute(productId);

    expect(result).toEqual(mockProduct);
    expect(mockProductRespository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockProductRespository.findOneBy).toHaveBeenCalledWith({
      id: mockProduct.id,
    });
  });

  it('Deve lançar um erro NotFoundException se o produto não existir', async () => {
    mockProductRespository.findOneBy.mockResolvedValue(null);

    const errorMessage = new RegExp(
      `Produto não encontrado com o ID: id-inexistente`,
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

    mockProductRespository.findOneBy.mockRejectedValue(errorContent);

    const errorMessage = new RegExp(
      `Erro na busca por produto: ${errorContent.message}`,
    );

    expect(provider.execute('123')).rejects.toThrow(errorMessage);
    expect(provider.execute('123')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
