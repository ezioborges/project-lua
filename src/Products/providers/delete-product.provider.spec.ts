import { Test, TestingModule } from '@nestjs/testing';
import { DeleteProductProvider } from './delete-product.provider';
import { Product } from '../entities/products.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('DeleteProductProvider', () => {
  let provider: DeleteProductProvider;

  const mockProductRepository = {
    findOneBy: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProductProvider,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    provider = module.get<DeleteProductProvider>(DeleteProductProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('Testa se o provider DeleteProductProvider está definido', () => {
    expect(provider).toBeDefined();
  });

  it('Testa se o produto é deletada com sucesso', async () => {
    const productId = '123';
    const fakeProduct = {
      id: productId,
      name: 'ingrediente da dto',
      price: 10.0,
      sku: 'SKU-001',
      stock_quantity: 3,
      categoryId: '123',
    };

    const mockDeletedResult = {
      affected: 1,
      raw: [],
      generatedMaps: [],
    };

    mockProductRepository.findOneBy.mockResolvedValue(fakeProduct);
    mockProductRepository.softDelete.mockResolvedValue(mockDeletedResult);

    const result = await provider.execute(fakeProduct.id);

    expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({
      id: productId,
    });

    expect(mockProductRepository.softDelete).toHaveBeenLastCalledWith(
      productId,
    );

    expect(result).toEqual(mockDeletedResult);
  });

  it('Deve lançar NotFoundException se não encontrar um produto para deletar', async () => {
    const productId = '123';

    mockProductRepository.findOneBy.mockResolvedValue(null);

    const errorMessage = new RegExp(
      `Produto não encontrado com o ID: ${productId}`,
      'i',
    );

    await expect(provider.execute(productId)).rejects.toThrow(errorMessage);
    await expect(provider.execute(productId)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockProductRepository.softDelete).not.toHaveBeenCalled();
  });

  it('Deve lançar InternalServerError em caso de erro no banco de dados', async () => {
    const productId = '123';
    const fakeProduct = {
      name: 'produto',
      price: 10,
      sku: 'SKU-001',
      stock_quantity: 3,
      categoryId: '123',
    };

    const errorException = new Error('Falha de conexão');

    mockProductRepository.findOneBy.mockResolvedValue(fakeProduct);
    mockProductRepository.softDelete.mockRejectedValue(errorException);

    const errorMessage = new RegExp(
      `Não foi possível deletar o produto: ${errorException.message}`,
      'i',
    );

    await expect(provider.execute(productId)).rejects.toThrow(errorMessage);
    await expect(provider.execute(productId)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(mockProductRepository.findOneBy).toHaveBeenCalled();
    expect(mockProductRepository.softDelete).toHaveBeenCalledWith(productId);
  });
});
