import { Test, TestingModule } from '@nestjs/testing';
import { FindSupplierByIdProvider } from './find-supplier-by-id.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Supplier } from '../entities/suppliers.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('FindSupplierByIdProvider', () => {
  let provider: FindSupplierByIdProvider;

  const mockSupplierRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindSupplierByIdProvider,
        {
          provide: getRepositoryToken(Supplier),
          useValue: mockSupplierRepository,
        },
      ],
    }).compile();

    provider = module.get<FindSupplierByIdProvider>(FindSupplierByIdProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('o provider deve FindCategoryByIdProvider deve estar definido', async () => {
    expect(provider).toBeDefined();
  });

  it('Deve retornar o fornecedor correto através do ID', async () => {
    const supplierId = '123';
    const supplier = { id: supplierId, name: 'fornecedor' };

    mockSupplierRepository.findOneBy.mockResolvedValue(supplier);

    const result = await provider.execute(supplierId);

    expect(result).toEqual(supplier);

    expect(mockSupplierRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockSupplierRepository.findOneBy).toHaveBeenCalledWith({
      id: supplierId,
    });
  });

  it('Deve lançar um erro NotFoundException se o fornecedor não existir', async () => {
    mockSupplierRepository.findOneBy.mockResolvedValue(null);

    const errorMessage = new RegExp(
      `Nenhum fornecedor encontrado com o ID: id-inexistente`,
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

    mockSupplierRepository.findOneBy.mockRejectedValue(errorContent);

    const errorMessage = new RegExp(
      `Nenhum fornecedor encontrado: ${errorContent.message}`,
    );

    expect(provider.execute('123')).rejects.toThrow(errorMessage);
    expect(provider.execute('123')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
