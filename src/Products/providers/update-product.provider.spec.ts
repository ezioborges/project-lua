import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProductProvider } from './update-product.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity';
import { UpdateProductDto } from '../dto/update-product.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('UpdateProductProvider', () => {
  let provider: UpdateProductProvider;

  const mockProductRepository = {
    findOneBy: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProductProvider,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    provider = module.get<UpdateProductProvider>(UpdateProductProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('o provider UpdateProductProvider deve estar definido', async () => {
    expect(provider).toBeDefined();
  });

  it('Deve ser possível atualizar um produto', async () => {
    const productId = '123';

    const updateProductDto: UpdateProductDto = {
      name: 'product 1',
      price: 10.0,
      sku: 'SKU-001',
      stock_quantity: 3,
      categoryId: '123',
    };

    const mockCategoryToEdit = {
      id: productId,
      name: 'nome antigo',
      price: 20.0,
    };

    const mockUpdatedCategory = {
      id: productId,
      name: 'product 1',
    };

    mockProductRepository.findOneBy.mockResolvedValue(mockCategoryToEdit);
    mockProductRepository.merge.mockReturnValue(mockUpdatedCategory);
    mockProductRepository.save.mockResolvedValue(mockUpdatedCategory);

    const result = await provider.execute(productId, updateProductDto);

    expect(mockProductRepository.findOneBy).toHaveBeenCalledWith({
      id: productId,
    });

    expect(mockProductRepository.merge).toHaveBeenCalledWith(
      mockCategoryToEdit,
      updateProductDto,
    );

    expect(mockProductRepository.save).toHaveBeenCalledWith(
      mockUpdatedCategory,
    );

    expect(result).toEqual(mockUpdatedCategory);
  });

  it('Deve lançar NotFoundException se o produto não existir', async () => {
    const categoryId = 'inexistente';

    const updateCategoryDto: UpdateProductDto = {
      name: 'novo shampoo',
    };

    mockProductRepository.findOneBy.mockResolvedValue(null);

    const errorMessage = new RegExp(
      `Produto não encontrado com o ID: ${categoryId}`,
      'i',
    );

    await expect(
      provider.execute(categoryId, updateCategoryDto),
    ).rejects.toThrow(errorMessage);

    await expect(
      provider.execute(categoryId, updateCategoryDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('Deve lançar InternalServerException se der erro no banco dados', async () => {
    const productId = '123';
    const updateDto: UpdateProductDto = { name: 'Teste' };
    const mockProduct = { id: productId, name: 'Novo' };

    const errorContent = new Error('Falha no banco de dados');

    mockProductRepository.findOneBy.mockResolvedValue(productId);
    mockProductRepository.merge.mockReturnValue(mockProduct);
    mockProductRepository.save.mockRejectedValue(errorContent);

    const errorMessage = new RegExp(
      `Erro ao atualizar produto: ${errorContent.message}`,
    );

    expect(provider.execute(productId, updateDto)).rejects.toThrow(
      errorMessage,
    );

    expect(provider.execute(productId, updateDto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
