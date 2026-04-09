import { Test, TestingModule } from '@nestjs/testing';
import { UpdateIngredientProvider } from './update-ingredient.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import { UpdateIngredientDto } from '../dto/update-ingredient.dto';

describe('UpdateCategoryProvider', () => {
  let provider: UpdateIngredientProvider;

  const mockIngredientRepository = {
    findOneBy: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateIngredientProvider,
        {
          provide: getRepositoryToken(Ingredient),
          useValue: mockIngredientRepository,
        },
      ],
    }).compile();

    provider = module.get<UpdateIngredientProvider>(UpdateIngredientProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('o provider UpdateCategoryProvider deve estar definido', async () => {
    expect(provider).toBeDefined();
  });

  it('Deve ser possível atualizar uma categoria', async () => {
    const ingredientId = '123';

    const updateCategoryDto: UpdateIngredientDto = { name: 'shampoo novo' };

    const mockCategoryToEdit = { id: ingredientId, name: 'nome antigo' };

    const mockUpdatedCategory = {
      id: ingredientId,
      name: 'ingrediente novo',
    };

    mockIngredientRepository.findOneBy.mockResolvedValue(mockCategoryToEdit);
    mockIngredientRepository.merge.mockReturnValue(mockUpdatedCategory);
    mockIngredientRepository.save.mockResolvedValue(mockUpdatedCategory);

    const result = await provider.execute(ingredientId, updateCategoryDto);

    expect(mockIngredientRepository.findOneBy).toHaveBeenCalledWith({
      id: ingredientId,
    });

    expect(mockIngredientRepository.merge).toHaveBeenCalledWith(
      mockCategoryToEdit,
      updateCategoryDto,
    );

    expect(mockIngredientRepository.save).toHaveBeenCalledWith(
      mockUpdatedCategory,
    );

    expect(result).toEqual(mockUpdatedCategory);
  });

  //   it('Deve lançar NotFoundException se a receita não existe', async () => {
  //     const categoryId = 'inexistente';

  //     const updateCategoryDto: UpdateCategoryDto = {
  //       name: 'novo shampoo',
  //     };

  //     mockCategoryRepository.findOne.mockResolvedValue(null);

  //     const errorMessage = new RegExp(
  //       `Categoria não encontrada com o ID: ${categoryId}`,
  //       'i',
  //     );

  //     await expect(
  //       provider.execute(categoryId, updateCategoryDto),
  //     ).rejects.toThrow(errorMessage);

  //     await expect(
  //       provider.execute(categoryId, updateCategoryDto),
  //     ).rejects.toThrow(NotFoundException);
  //   });

  //   it('Deve lançar ConflictException se houver duplicação de dados (ER_DUP_ENTRY)', async () => {
  //     const categoryId = '123';
  //     const updateCategoryDto: UpdateCategoryDto = { name: 'shampoo novo' };
  //     const mockCategory = { id: categoryId, name: 'shampoo antigo' };

  //     mockCategoryRepository.findOne.mockResolvedValue(mockCategory);
  //     mockCategoryRepository.merge.mockReturnValue(mockCategory);

  //     const duplicateError = { code: 'ER_DUP_ENTRY' };
  //     mockCategoryRepository.save.mockRejectedValue(duplicateError);

  //     await expect(
  //       provider.execute(categoryId, updateCategoryDto),
  //     ).rejects.toThrow(
  //       new ConflictException('Já existe uma categoria com este código (sku)'),
  //     );
  //   });

  //   it('Deve lançar InternalServerException se der erro no banco dados', async () => {
  //     const categoryId = '123';
  //     const updateDto: UpdateCategoryDto = { name: 'Teste' };
  //     const mockCategory = { id: categoryId, name: 'Antigo' };

  //     const errorContent = new Error('Falha no banco de dados');

  //     mockCategoryRepository.findOne.mockResolvedValue(categoryId);
  //     mockCategoryRepository.merge.mockReturnValue(mockCategory);
  //     mockCategoryRepository.save.mockRejectedValue(errorContent);

  //     const errorMessage = new RegExp(
  //       `Erro ao salvar a categoria no banco de dados: ${errorContent.message}`,
  //     );

  //     expect(provider.execute(categoryId, updateDto)).rejects.toThrow(
  //       errorMessage,
  //     );

  //     expect(provider.execute(categoryId, updateDto)).rejects.toThrow(
  //       InternalServerErrorException,
  //     );
  //   });
});
