import { Test, TestingModule } from '@nestjs/testing';
import { DeleteSupplierProvider } from './delete-supplier.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Supplier } from '../entities/suppliers.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('DeleteSupplierProvider', () => {
  let provider: DeleteSupplierProvider;

  const mockSupplierRepository = {
    findOneBy: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteSupplierProvider,
        {
          provide: getRepositoryToken(Supplier),
          useValue: mockSupplierRepository,
        },
      ],
    }).compile();

    provider = module.get<DeleteSupplierProvider>(DeleteSupplierProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('Testa se o provider DeleteProductProvider está definido', () => {
    expect(provider).toBeDefined();
  });

  it('Testa se o fornecedor é deletado com sucesso', async () => {
    const supplierId = '123';
    const fakeSupplier = {
      id: supplierId,
      name: 'fornecedor',
    };

    const mockDeletedResult = {
      affected: 1,
      raw: [],
      generatedMaps: [],
    };

    mockSupplierRepository.findOneBy.mockResolvedValue(fakeSupplier);
    mockSupplierRepository.softDelete.mockResolvedValue(mockDeletedResult);

    const result = await provider.execute(fakeSupplier.id);

    expect(mockSupplierRepository.findOneBy).toHaveBeenCalledWith({
      id: fakeSupplier.id,
    });

    expect(mockSupplierRepository.softDelete).toHaveBeenCalledWith(supplierId);

    expect(result).toEqual(mockDeletedResult);
  });

  it('Deve lançar NotFoundException se não encontrar um fornecedor para deletar', async () => {
    const supplierId = '123';

    mockSupplierRepository.findOneBy.mockResolvedValue(null);

    const errorMessage = new RegExp(
      `Nenhum forncedor encontrado com o ID: ${supplierId}`,
      'i',
    );

    await expect(provider.execute(supplierId)).rejects.toThrow(errorMessage);
    await expect(provider.execute(supplierId)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockSupplierRepository.softDelete).not.toHaveBeenCalled();
  });

  it('Deve lançar InternalServerError em caso de erro no banco de dados', async () => {
    const supplierId = '123';
    const fakesupplier = {
      id: supplierId,
      name: 'fornecedor',
    };

    const errorException = new Error('Falha de conexão');

    mockSupplierRepository.findOneBy.mockResolvedValue(fakesupplier);
    mockSupplierRepository.softDelete.mockRejectedValue(errorException);

    const errorMessage = new RegExp(
      `Erro ao deletar fornecedor: ${errorException.message}`,
      'i',
    );

    await expect(provider.execute(supplierId)).rejects.toThrow(errorMessage);
    await expect(provider.execute(supplierId)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(mockSupplierRepository.findOneBy).toHaveBeenCalled();
    expect(mockSupplierRepository.softDelete).toHaveBeenCalledWith(supplierId);
  });
});
