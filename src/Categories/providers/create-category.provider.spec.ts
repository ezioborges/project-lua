import { Test, TestingModule } from '@nestjs/testing';
import { CreateCategoryProvider } from './create-category.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { CategoryValidator } from '../services/categories-validators.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('CreateCategoryProvider', () => {
  let provider: CreateCategoryProvider;

  const mockCategoryRespository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockCategoryValidator = {
    checkProductValidation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCategoryProvider,
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRespository,
        },
        // Tenho que passar aqui também a função de validação.
        // Já que ela está inserida no constructor do provider
        {
          provide: CategoryValidator,
          useValue: mockCategoryValidator,
        },
      ],
    }).compile();

    provider = module.get<CreateCategoryProvider>(CreateCategoryProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('O provider CreateCetagoryProvider deve estar definido', () => {
    expect(provider).toBeDefined();
  });

  it('Deve criar e salvar uma categoria com sucesso', async () => {
    const fakeCategoryDto: CreateCategoryDto = {
      name: 'categoria',
    };

    const mockSavedCategory = { id: '123', name: 'categoria' };

    mockCategoryRespository.create.mockReturnValue(fakeCategoryDto);
    mockCategoryRespository.save.mockResolvedValue(mockSavedCategory);

    const result = await provider.execute(fakeCategoryDto);

    expect(mockCategoryRespository.save).toHaveBeenCalled();
    expect(result).toEqual(mockSavedCategory);
  });

  it('Deve lançar ConflictException se a categoria já existir', async () => {
    const fakeCategoryDto: CreateCategoryDto = { name: 'categoria' };

    mockCategoryValidator.checkProductValidation.mockRejectedValue(
      new ConflictException(`Categoria já cadastrado`),
    );

    const errorMessage = new RegExp(`Categoria já cadastrado`, 'i');

    await expect(provider.execute(fakeCategoryDto)).rejects.toThrow(
      errorMessage,
    );

    await expect(provider.execute(fakeCategoryDto)).rejects.toThrow(
      ConflictException,
    );

    expect(mockCategoryRespository.create).not.toHaveBeenCalled();
    expect(mockCategoryRespository.save).not.toHaveBeenCalled();
  });

  it('Deve lançar InternalServerErrorException se o banco de dados falhar', async () => {
    const fakeCategoryDto: CreateCategoryDto = { name: 'categoria' };

    mockCategoryValidator.checkProductValidation.mockRejectedValue(
      new Error(`Data base com erro`),
    );

    const errorMessage = new RegExp(
      `Erro ao criar Categoria: Data base com erro`,
      'i',
    );

    await expect(provider.execute(fakeCategoryDto)).rejects.toThrow(
      InternalServerErrorException,
    );

    await expect(provider.execute(fakeCategoryDto)).rejects.toThrow(
      errorMessage,
    );

    expect(mockCategoryRespository.create).not.toHaveBeenCalled();
    expect(mockCategoryRespository.save).not.toHaveBeenCalled();
  });
});
