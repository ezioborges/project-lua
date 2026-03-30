import { Test, TestingModule } from '@nestjs/testing';
import { DeleteCategoryProvider } from './delete-category.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('DeleteCategoryProvider', () => {
  let provider: DeleteCategoryProvider;

  const mockCategoryRepository = {
    findOneBy: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteCategoryProvider,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    provider = module.get<DeleteCategoryProvider>(DeleteCategoryProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('Testa se o provider DeleteCategoryProvider está definido', () => {
    expect(provider).toBeDefined();
  });

  it('Testa se a categoria é deletada com sucesso', async () => {
    const categoryId = '123';
    const fakeCategory = { id: categoryId, name: 'shampoo' };

    const mockDeletedResult = {
      affected: 1,
      raw: [],
      generatedMaps: [],
    };

    mockCategoryRepository.findOneBy.mockResolvedValue(fakeCategory);
    mockCategoryRepository.softDelete.mockResolvedValue(mockDeletedResult);

    const result = await provider.execute(fakeCategory.id);

    expect(mockCategoryRepository.findOneBy).toHaveBeenCalledWith({
      id: categoryId,
    });

    expect(mockCategoryRepository.softDelete).toHaveBeenLastCalledWith(
      categoryId,
    );

    expect(result).toEqual(mockDeletedResult);
  });

  it('Deve lançar NotFoundException se não encontrar uma categoria para deletar', async () => {
    const categoryId = '123';

    mockCategoryRepository.findOneBy.mockResolvedValue(null);

    const errorMessage = new RegExp(
      `Nenhuma categoria encontrado com o ID: ${categoryId}`,
      'i',
    );

    await expect(provider.execute(categoryId)).rejects.toThrow(errorMessage);
    await expect(provider.execute(categoryId)).rejects.toThrow(
      NotFoundException,
    );

    expect(mockCategoryRepository.softDelete).not.toHaveBeenCalled();
  });

  it('Deve lançar InternalServerError em caso de erro no banco de dados', async () => {
    const categoryId = '123';

    mockCategoryRepository.findOneBy.mockRejectedValue(
      new Error('Falha de conexão'),
    );

    const errorMessage = new RegExp(
      'Não foi possível deletar a categoria: Falha de conexão',
      'i',
    );

    await expect(provider.execute(categoryId)).rejects.toThrow(errorMessage);
    await expect(provider.execute(categoryId)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(mockCategoryRepository.findOneBy).toHaveBeenCalled();
    expect(mockCategoryRepository.softDelete).not.toHaveBeenCalled();
  });
});
