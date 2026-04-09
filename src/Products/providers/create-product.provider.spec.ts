import { Test, TestingModule } from '@nestjs/testing';
import { CreateProductProvider } from './create-product.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('CreateProductProvider', () => {
  let provider: CreateProductProvider;

  const mockProductRespository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateProductProvider,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRespository,
        },
      ],
    }).compile();

    provider = module.get<CreateProductProvider>(CreateProductProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('O provider CreateProductProvider deve estar definido', () => {
    expect(provider).toBeDefined();
  });

  it('Deve criar e salvar um produto com sucesso', async () => {
    const fakeProductDto: CreateProductDto = {
      name: 'ingrediente da dto',
      price: 10.0,
      sku: 'SKU-001',
      stock_quantity: 3,
      categoryId: '123',
    };

    const mockSavedProduct = { id: '123', name: 'ingrediente da dto' };

    mockProductRespository.create.mockReturnValue(fakeProductDto);
    mockProductRespository.save.mockResolvedValue(mockSavedProduct);

    const result = await provider.execute(fakeProductDto);

    expect(mockProductRespository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ...fakeProductDto,
        category: { id: fakeProductDto.categoryId },
        supplier: undefined,
      }),
    );
    expect(mockProductRespository.save).toHaveBeenCalled();
    expect(result).toEqual(mockSavedProduct);
  });

  it('Deve lançar ConflictException quando o SKU já existir', async () => {
    const fakeProductDto: CreateProductDto = {
      name: 'produto duplicado',
      price: 10,
      sku: 'SKU-001',
      stock_quantity: 3,
      categoryId: '123',
    };

    mockProductRespository.create.mockReturnValue({
      ...fakeProductDto,
      category: { id: fakeProductDto.categoryId },
      supplier: undefined,
    });

    mockProductRespository.save.mockRejectedValue({
      code: 'ER_DUP_ENTRY',
      message: 'Duplicate entry',
    });

    const execution = provider.execute(fakeProductDto);

    await expect(execution).rejects.toBeInstanceOf(ConflictException);
    await expect(execution).rejects.toMatchObject({
      message:
        'Já existe um produto cadastrado com este código (sku): Duplicate entry',
    });

    expect(mockProductRespository.create).toHaveBeenCalled();
    expect(mockProductRespository.save).toHaveBeenCalled();
  });

  it('Deve lançar InternalServerErrorException se o banco de dados falhar', async () => {
    const fakeProductDto: CreateProductDto = {
      name: 'produto duplicado',
      price: 10,
      sku: 'SKU-001',
      stock_quantity: 3,
      categoryId: '123',
    };

    mockProductRespository.create.mockReturnValue({
      ...fakeProductDto,
      category: { id: fakeProductDto.categoryId },
      supplier: undefined,
    });

    mockProductRespository.save.mockRejectedValue(
      new Error('Data base com erro'),
    );

    const execution = provider.execute(fakeProductDto);

    await expect(execution).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
    await expect(execution).rejects.toMatchObject({
      message: 'Erro ao salvar o produto no banco de dados: Data base com erro',
    });

    expect(mockProductRespository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        ...fakeProductDto,
        category: { id: fakeProductDto.categoryId },
        supplier: undefined,
      }),
    );
    expect(mockProductRespository.save).toHaveBeenCalled();
  });
});
