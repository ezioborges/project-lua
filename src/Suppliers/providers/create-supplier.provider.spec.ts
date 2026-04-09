import { Test, TestingModule } from '@nestjs/testing';
import { CreateSupplierProvider } from './create-supplier.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Supplier } from '../entities/suppliers.entity';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { InternalServerErrorException } from '@nestjs/common';

describe('CreateSupplierProvider', () => {
  let provider: CreateSupplierProvider;

  // Mock do
  const mockSupplierRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateSupplierProvider,
        {
          provide: getRepositoryToken(Supplier),
          useValue: mockSupplierRepository,
        },
      ],
    }).compile();

    provider = module.get<CreateSupplierProvider>(CreateSupplierProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('O provider de CreateRecipeProvider deve estar definido', () => {
    expect(provider).toBeDefined();
  });

  it('Deve criar e salvar um fornecedor com sucesso', async () => {
    const fakeSupplierDto: CreateSupplierDto = {
      name: 'fornecedor',
    };

    const mockSavedSupplier = { id: '123', name: 'fornecedor' };

    mockSupplierRepository.create.mockReturnValue(fakeSupplierDto);
    mockSupplierRepository.save.mockResolvedValue(mockSavedSupplier);

    const result = await provider.execute(fakeSupplierDto);

    expect(mockSupplierRepository.create).toHaveBeenCalled();

    expect(mockSupplierRepository.save).toHaveBeenCalled();
    expect(result).toEqual(mockSavedSupplier);
  });

  it('Deve lançar InternalServerErrorException se o banco de dados falhar no save', async () => {
    const fakeSupplierDto: CreateSupplierDto = {
      name: 'fornecedor',
    };

    mockSupplierRepository.create.mockReturnValue(fakeSupplierDto);
    mockSupplierRepository.save.mockRejectedValue(
      new Error('Falha de conexão'),
    );

    const regexMessage = new RegExp(
      `Erro ao criar Fornecedor: Falha de conexão`,
      'i',
    );

    await expect(provider.execute(fakeSupplierDto)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(provider.execute(fakeSupplierDto)).rejects.toThrow(
      regexMessage,
    );
  });
});
