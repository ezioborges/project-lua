import { Test, TestingModule } from '@nestjs/testing';
import { UpdateCategoryProvider } from './update-category.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { UpdateCategoryDto } from '../dto/update-category.dto';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('UpdateCategoryProvider', () => {
  let provider: UpdateCategoryProvider;

  const mockCategoryRepository = {
    findOne: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateCategoryProvider,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    provider = module.get<UpdateCategoryProvider>(UpdateCategoryProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('o provider UpdateCategoryProvider deve estar definido', async () => {
    expect(provider).toBeDefined();
  });

  it('Deve ser possível atualizar uma categoria', async () => {
    const categoryId = '123';

    const updateCategoryDto: UpdateCategoryDto = { name: 'shampoo novo' };

    const mockCategoryToEdit = { id: categoryId, name: 'nome antigo' };

    const mockUpdatedCategory = {
      id: categoryId,
      name: 'shampoo novo',
    };

    mockCategoryRepository.findOne.mockResolvedValue(mockCategoryToEdit);
    mockCategoryRepository.merge.mockReturnValue(mockUpdatedCategory);
    mockCategoryRepository.save.mockResolvedValue(mockUpdatedCategory);

    const result = await provider.execute(categoryId, updateCategoryDto);

    expect(mockCategoryRepository.findOne).toHaveBeenCalledWith({
      where: { id: categoryId },
    });

    expect(mockCategoryRepository.merge).toHaveBeenCalledWith(
      mockCategoryToEdit,
      updateCategoryDto,
    );

    expect(mockCategoryRepository.save).toHaveBeenCalledWith(
      mockUpdatedCategory,
    );

    expect(result).toEqual(mockUpdatedCategory);
  });

  it('Deve lançar NotFoundException se a receita não existe', async () => {
    const categoryId = 'inexistente';

    const updateCategoryDto: UpdateCategoryDto = {
      name: 'novo shampoo',
    };

    mockCategoryRepository.findOne.mockResolvedValue(null);

    const errorMessage = new RegExp(
      `Categoria não encontrada com o ID: ${categoryId}`,
      'i',
    );

    await expect(
      provider.execute(categoryId, updateCategoryDto),
    ).rejects.toThrow(errorMessage);

    await expect(
      provider.execute(categoryId, updateCategoryDto),
    ).rejects.toThrow(NotFoundException);
  });

  it('Deve lançar ConflictException se houver duplicação de dados (ER_DUP_ENTRY)', async () => {
    const categoryId = '123';
    const updateCategoryDto: UpdateCategoryDto = { name: 'shampoo novo' };
    const mockCategory = { id: categoryId, name: 'shampoo antigo' };

    mockCategoryRepository.findOne.mockResolvedValue(mockCategory);
    mockCategoryRepository.merge.mockReturnValue(mockCategory);

    const duplicateError = { code: 'ER_DUP_ENTRY' };
    mockCategoryRepository.save.mockRejectedValue(duplicateError);

    await expect(
      provider.execute(categoryId, updateCategoryDto),
    ).rejects.toThrow(
      new ConflictException('Já existe uma categoria com este código (sku)'),
    );
  });

  it('Deve lançar InternalServerException se der erro no banco dados', async () => {
    const categoryId = '123';
    const updateDto: UpdateCategoryDto = { name: 'Teste' };
    const mockCategory = { id: categoryId, name: 'Antigo' };

    const errorContent = new Error('Falha no banco de dados');

    mockCategoryRepository.findOne.mockResolvedValue(categoryId);
    mockCategoryRepository.merge.mockReturnValue(mockCategory);
    mockCategoryRepository.save.mockRejectedValue(errorContent);

    const errorMessage = new RegExp(
      `Erro ao salvar a categoria no banco de dados: ${errorContent.message}`,
    );

    expect(provider.execute(categoryId, updateDto)).rejects.toThrow(
      errorMessage,
    );

    expect(provider.execute(categoryId, updateDto)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
