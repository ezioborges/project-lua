import { getRepositoryToken } from '@nestjs/typeorm';
import { UpdateSupplierProvider } from './update-supplier.provider';
import { Supplier } from '../entities/suppliers.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('UpdateSupplierProvider', () => {
  let provider: UpdateSupplierProvider;

  const mockSupplierRepository = {
    findOne: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateSupplierProvider,
        {
          provide: getRepositoryToken(Supplier),
          useValue: mockSupplierRepository,
        },
      ],
    }).compile();

    provider = module.get<UpdateSupplierProvider>(UpdateSupplierProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('o provider UpdateSupplierProvider deve estar definido', async () => {
    expect(provider).toBeDefined();
  });

  it('Deve ser possível atualizar um fornecedor', async () => {
    const supplierId = '123';

    const updateSupplierDto: UpdateSupplierDto = { name: 'novo nome' };

    const supplierToEdit = { id: supplierId, name: 'nome antigo' };

    const mockUpdatedSupplier = {
      id: supplierId,
      name: 'novo nome',
    };

    mockSupplierRepository.findOne.mockResolvedValue(supplierToEdit);
    mockSupplierRepository.merge.mockReturnValue(mockUpdatedSupplier);
    mockSupplierRepository.save.mockResolvedValue(mockUpdatedSupplier);

    const result = await provider.execute(supplierId, updateSupplierDto);

    expect(mockSupplierRepository.findOne).toHaveBeenCalledWith({
      where: { id: supplierId },
    });

    expect(mockSupplierRepository.merge).toHaveBeenCalledWith(
      supplierToEdit,
      updateSupplierDto,
    );

    expect(mockSupplierRepository.save).toHaveBeenCalledWith(
      mockUpdatedSupplier,
    );

    expect(result).toEqual({
      id: supplierId,
      name: 'novo nome',
    });
  });

  it('Deve lançar NotFoundException se o fornecedor não existir', async () => {
    const supplierId = 'inexistente';

    const updateSupplierDto: UpdateSupplierDto = {
      name: 'novo nome',
    };

    mockSupplierRepository.findOne.mockResolvedValue(null);

    const errorMessage = new RegExp(
      `Nenhum fornecedor encontrado com o ID: ${supplierId}`,
      'i',
    );

    await expect(
      provider.execute(supplierId, updateSupplierDto),
    ).rejects.toThrow(errorMessage);

    await expect(
      provider.execute(supplierId, updateSupplierDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('Deve lançar ConflictException se houver duplicação de dados (ER_DUP_ENTRY)', async () => {
    const supplierId = '123';
    const updateSupplierDto: UpdateSupplierDto = { name: 'nome novo' };
    const supllier = { id: supplierId, name: 'nome antigo' };

    mockSupplierRepository.findOne.mockResolvedValue(supllier);
    mockSupplierRepository.merge.mockReturnValue(supllier);

    const duplicateError = { code: 'ER_DUP_ENTRY' };
    mockSupplierRepository.save.mockRejectedValue(duplicateError);

    const errorMessage = new RegExp(`Já existe um fornecedor com o nome.`, 'i');

    const result = provider.execute(supplierId, updateSupplierDto);

    expect(result).rejects.toThrow(errorMessage);
    expect(result).rejects.toThrow(ConflictException);
  });

  it('Deve lançar InternalServerException se der erro no banco dados', async () => {
    const supllierId = '123';
    const updateDto: UpdateSupplierDto = { name: 'Teste' };

    const errorContent = new Error('Falha no banco de dados');

    mockSupplierRepository.save.mockRejectedValue(errorContent);

    const errorMessage = new RegExp(
      `Erro na busca por fornecedores: ${errorContent.message}`,
    );

    const result = provider.execute(supllierId, updateDto);

    expect(result).rejects.toThrow(errorMessage);

    expect(result).rejects.toThrow(InternalServerErrorException);
  });
});
