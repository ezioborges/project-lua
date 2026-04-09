import { Test, TestingModule } from '@nestjs/testing';
import { FindAllSuppliersProvider } from './find-all-suppliers.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Supplier } from '../entities/suppliers.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('FindAllSuppliersProvider', () => {
  let provider: FindAllSuppliersProvider;

  const mockSupplierRepository = {
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllSuppliersProvider,
        {
          provide: getRepositoryToken(Supplier),
          useValue: mockSupplierRepository,
        },
      ],
    }).compile();

    provider = module.get<FindAllSuppliersProvider>(FindAllSuppliersProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('Testas e o provider de FindAllCategoriesProvider deve estar definido', async () => {
    expect(provider).toBeDefined();
  });

  it('Deve listar todas os fornecedores usando paginação e limite', async () => {
    const suppliers = [
      { id: '1', name: 'fornecedor 1' },
      { id: '2', name: 'fornecedor 2' },
    ];

    const mockTotal = 2;

    mockSupplierRepository.findAndCount.mockResolvedValue([
      suppliers,
      mockTotal,
    ]);

    const result = await provider.execute();

    expect(mockSupplierRepository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 10,
        skip: 0,
      }),
    );

    expect(result).toEqual({
      suppliers,
      meta: {
        total: mockTotal,
        page: 1,
        lastPage: 1,
      },
    });
  });

  it('Deve calculaer corretamente o skip e a lastPage para paginação customizada', async () => {
    const suppliers = [{ id: '1', name: 'shampoo' }];
    const mockTotal = 12;

    mockSupplierRepository.findAndCount.mockResolvedValue([
      suppliers,
      mockTotal,
    ]);

    const result = await provider.execute(2, 5);

    expect(mockSupplierRepository.findAndCount).toHaveBeenCalledWith(
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

  it('Deve retornar NotFoundException se nenhum fornecedor for encontrado', async () => {
    // Aqui eu preciso resolver o mock para que não pule direto para o catch
    mockSupplierRepository.findAndCount.mockResolvedValue([[], 0]);

    const errorMessage = new RegExp(
      `Nenhum fornecedor encontrado ou cadastrado`,
    );

    await expect(provider.execute()).rejects.toThrow(NotFoundException);
    await expect(provider.execute()).rejects.toThrow(errorMessage);
  });

  it('Deve lançar o erro InternalServerException', async () => {
    const errorTest = new Error(`Falha na conexão`);
    mockSupplierRepository.findAndCount.mockRejectedValue(errorTest);

    const errorMessage = new RegExp(
      `Erro ao buscar os fornecedores: ${errorTest.message}`,
      'i',
    );

    await expect(provider.execute()).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(provider.execute()).rejects.toThrow(errorMessage);
  });
});
