import { Test, TestingModule } from '@nestjs/testing';
import { UpdateRecipeProvider } from './update-recipe.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Recipe } from '../entities/recipe.entity';
import { RecipeIngredient } from 'src/RecipeIngredient/entities/recipe-ingredient.entity';
import { UpdateRecipeDto } from '../dto/update-recipe.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('UpdateRecipeProvider', () => {
  let provider: UpdateRecipeProvider;

  const mockRecipeRepository = {
    findOneBy: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
  };

  const mockRecipeIngredientsRepository = {
    delete: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateRecipeProvider,
        {
          provide: getRepositoryToken(Recipe),
          useValue: mockRecipeRepository,
        },
        {
          provide: getRepositoryToken(RecipeIngredient),
          useValue: mockRecipeIngredientsRepository,
        },
      ],
    }).compile();

    provider = module.get<UpdateRecipeProvider>(UpdateRecipeProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('O provider UpdateRecipeProvider deve estar definido', () => {
    expect(provider).toBeDefined();
  });

  it('Deve atualizar os dados da receita', async () => {
    const recipeId = '123';

    const updateRecipeDto: UpdateRecipeDto = {
      name: 'Shampoo Novo',
      recipeIngredients: [{ ingredientId: 'ing-1', quantity: 200, unit: 'ml' }],
    };

    // cria os mocks da edição
    // Receita que vai ser editada
    const mockRecipeToEdit = { id: recipeId, name: 'shampoo velho' };

    // Receita que vai ser incluida dentro do recipeIngredient
    const mockCreatedIngredient = {
      recipe: { id: recipeId },
      ingredient: {
        id: 'ing-1',
      },
      quantity: 200,
      unit: 'ml',
    };

    // Receita atualizada
    const mockUpdatedRecipe = {
      id: recipeId,
      name: 'Shampoo Novo',
      recipeIngredient: [mockCreatedIngredient],
    };

    // consiguração dos mocks
    // 1. Encontra a receita que vai ser editada
    mockRecipeRepository.findOneBy.mockResolvedValue(mockRecipeToEdit);

    // 2. O update genérico pra mostrar que uma linha foi afetada
    mockRecipeRepository.update.mockResolvedValue({ affected: 1 });

    // 3. Delete os recipeIngredient antigos
    mockRecipeIngredientsRepository.delete.mockResolvedValue({ affected: 1 });

    // 4. Cria os novos ingredientes na memória
    mockRecipeIngredientsRepository.create.mockReturnValue(
      mockCreatedIngredient,
    );

    // 5. Salva as receitas que foram criadas no banco
    mockRecipeIngredientsRepository.save.mockResolvedValue([
      mockCreatedIngredient,
    ]);

    // 6. Resultado do retorno final. Que traz o objeto que foi atualizado.
    mockRecipeRepository.findOne.mockResolvedValue(mockUpdatedRecipe);

    // Act
    const result = await provider.execute(recipeId, updateRecipeDto);

    // Assert
    expect(mockRecipeRepository.findOneBy).toHaveBeenCalledWith({
      id: recipeId,
    });

    expect(mockRecipeRepository.update).toHaveBeenCalledWith(recipeId, {
      name: 'Shampoo Novo',
    });

    expect(mockRecipeIngredientsRepository.delete).toHaveBeenCalledWith({
      recipe: { id: recipeId },
    });

    expect(result).toEqual(mockUpdatedRecipe);
  });

  it('Deve atualizar apenas os dados básicos se não enviar ingredientes', async () => {
    // Arrange
    const recipeId = '123';

    const mockRecipeDto: UpdateRecipeDto = {
      name: 'Shampoo Novo',
    };

    // Aqui eu passo o retorno esperado quando faço a busca pelo id
    mockRecipeRepository.findOneBy.mockResolvedValue({
      id: recipeId,
      name: 'shampoo antigo',
    });

    // no caso do delete e do update ele retorna as linhas afetadas
    mockRecipeRepository.update.mockResolvedValue({ affected: 1 });

    mockRecipeRepository.findOneBy.mockResolvedValue({
      id: recipeId,
      name: 'Shampoo Novo',
    });

    // Act
    await provider.execute(recipeId, mockRecipeDto);

    // Assert
    expect(mockRecipeRepository.update).toHaveBeenCalled();

    // Nesse caso precisa garantir pulou a parte de ingredientes
    expect(mockRecipeIngredientsRepository.delete).not.toHaveBeenCalled();
    expect(mockRecipeIngredientsRepository.save).not.toHaveBeenCalled();
  });

  it('Deve atualizar apenas os ingredientes se não enviar dados básicos', async () => {
    const recipeId = '123';

    const updateRecipeDto: UpdateRecipeDto = {
      recipeIngredients: [{ ingredientId: 'ing-1', quantity: 10, unit: 'g' }],
    };

    mockRecipeRepository.findOneBy.mockResolvedValue({
      id: recipeId,
      name: 'Shampoo Atual',
    });
    mockRecipeIngredientsRepository.create.mockReturnValue({});
    mockRecipeRepository.findOne.mockResolvedValue({});

    await provider.execute(recipeId, updateRecipeDto);

    // Garantir que o update dentro do if não seja chamado
    expect(mockRecipeRepository.update).not.toHaveBeenCalled();
    expect(mockRecipeIngredientsRepository.delete).toHaveBeenCalled();
    expect(mockRecipeIngredientsRepository.save).toHaveBeenCalled();
  });

  it('Deve lançar NotFoundException se a receita não existir', async () => {
    const recipeId = 'inexistente';
    const updateDto: UpdateRecipeDto = {
      name: 'Shampoo Novo',
    };

    mockRecipeRepository.findOneBy.mockResolvedValue(null);

    const errorMessage = new RegExp(
      `Não foi encontrada receita com o ID: ${recipeId}`,
      'i',
    );

    await expect(provider.execute(recipeId, updateDto)).rejects.toThrow(
      NotFoundException,
    );
    await expect(provider.execute(recipeId, updateDto)).rejects.toThrow(
      errorMessage,
    );
  });

  it('Deve lançar InternalServerErrorException em caso de erro no banco', async () => {
    const recipeId = '123';
    const updateDto: UpdateRecipeDto = { name: 'Teste' };

    // Simulando falha de banco logo na primeira busca
    mockRecipeRepository.findOneBy.mockRejectedValue(
      new Error('Banco explodiu'),
    );

    const errorMessage = new RegExp(
      `não foi possível atualizar a receita: banco explodiu`,
      'i',
    );

    await expect(provider.execute(recipeId, updateDto)).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(provider.execute(recipeId, updateDto)).rejects.toThrow(
      errorMessage,
    );
  });
});
