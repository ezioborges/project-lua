import { Test, TestingModule } from '@nestjs/testing';
import { FindCategoryByIdProvider } from './find-category-by-id.provider';
import { Category } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('FindCategoryByIdProvider', () => {
  let provider: FindCategoryByIdProvider;

  const mockCategoryRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindCategoryByIdProvider,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    provider = module.get<FindCategoryByIdProvider>(FindCategoryByIdProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('o provider deve FindCategoryByIdProvider deve estar definido', async () => {
    expect(provider).toBeDefined();
  });

  it('Deve retornar a categoria correta através do ID', async () => {
    const categoryId = '123';
    const categorie = { id: categoryId, name: 'shampoo' };

    mockCategoryRepository.findOneBy.mockResolvedValue(categorie);

    const result = await provider.execute(categoryId);

    expect(result).toEqual(categorie);
    expect(mockCategoryRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockCategoryRepository.findOneBy).toHaveBeenCalledWith({
      id: categoryId,
    });
  });

  it('Deve lançar um erro NotFoundException se a receita não existir', async () => {
    mockCategoryRepository.findOneBy.mockResolvedValue(null);

    const errorMessage = new RegExp(
      `Nenhuma categoria encontrado com o ID: id-inexistente`,
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

    mockCategoryRepository.findOneBy.mockRejectedValue(errorContent);

    const errorMessage = new RegExp(
      `Erro ao buscar a categoria pelo ID: ${errorContent.message}`,
    );

    expect(provider.execute('123')).rejects.toThrow(errorMessage);
    expect(provider.execute('123')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
