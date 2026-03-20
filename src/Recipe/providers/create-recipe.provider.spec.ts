import { Test, TestingModule } from '@nestjs/testing';
import { CreateRecipeProvider } from './create-recipe.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Recipe } from '../entities/recipe.entity';
import { RecipeIngredient } from 'src/RecipeIngredient/entities/recipe-ingredient.entity';
import { CreateRecipeDto } from '../dto/create-recipe.dto';

describe('CreateRecipeProvider', () => {
  let provider: CreateRecipeProvider;

  // Mock do
  const mockRecipeRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockRecipeIngredientRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateRecipeProvider,
        {
          provide: getRepositoryToken(Recipe),
          useValue: mockRecipeRepository,
        },
        {
          provide: getRepositoryToken(RecipeIngredient),
          useValue: mockRecipeIngredientRepository,
        },
      ],
    }).compile();

    provider = module.get<CreateRecipeProvider>(CreateRecipeProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('O provider de CreateRecipeProvider deve estar definido', () => {
    expect(provider).toBeDefined();
  });

  it('Deve criar e salvar uma receita com sucesso', async () => {
    // Arrange (Preparação)
    // Pirmeiro crio o Dto necessário para criar uma receita
    const fakeRecipeDto: CreateRecipeDto = {
      name: 'Shampoo',
      recipeIngredients: [{ ingredientId: 'ing-1', quantity: 100, unit: 'ml' }],
    };

    // Aqui crio o uma receita
    const mockSavedRecipe = { id: '123', name: 'Shampoo' };

    // Aqui eu crio um ingrediente
    const mockCreatedIngredient = {
      recipe: { id: '123' },
      ingredient: { id: 'ing-1' },
      quantity: 100,
      unit: 'ml',
    };

    // Configura o comportamento dos mocks:
    // mockResolvedValue: Usado em métodos assincronos
    mockRecipeRepository.findOneBy.mockResolvedValue(null); // Retorna null (receita não existe)
    // mockReturnValue: Usada em métodos sincronos
    mockRecipeRepository.create.mockReturnValue(fakeRecipeDto); // Retorna o objeto criado na memória.
    mockRecipeRepository.save.mockResolvedValue(mockSavedRecipe); // Retorna a receita salva com ID

    mockRecipeIngredientRepository.create.mockReturnValue(
      mockCreatedIngredient,
    );
    mockRecipeIngredientRepository.save.mockResolvedValue([
      mockCreatedIngredient,
    ]);

    // Act (Ação)
    const result = await provider.execute(fakeRecipeDto); // O método se chama execute!

    // Assert (Verificação)
    // Verifica se a receita já foi criada
    expect(mockRecipeRepository.findOneBy).toHaveBeenCalledWith({
      name: fakeRecipeDto.name,
    });

    // Verifica se o método foi chamado para criar uma receita
    expect(mockRecipeRepository.save).toHaveBeenCalled();

    // Verifica se o método foi chamado para criar lista de ingredientes
    expect(mockRecipeIngredientRepository.save).toHaveBeenCalled();

    // Verifica se o retorno final junta a receita com os ingredientes
    expect(result).toEqual({
      ...mockSavedRecipe,
      recipeIngredients: [mockCreatedIngredient],
    });
  });

  it('Deve lançar ConflictException se a receita já existir', async () => {
    //Arrange

    //Cria a Dto fake
    const fakeRecipeDto: CreateRecipeDto = {
      name: 'shampoo',
      recipeIngredients: [],
    };

    // Busca uma receita que já existe
    mockRecipeRepository.findOneBy.mockResolvedValue({
      id: '123',
      name: 'shampoo',
    });

    // Act & Assert
    // Quando espero um erro
    const regexMessage = new RegExp(
      `Uma receita já foi cadastrada com o nome: ${fakeRecipeDto.name}`,
      'i',
    );
    await expect(provider.execute(fakeRecipeDto)).rejects.toThrow(regexMessage);

    expect(mockRecipeRepository.save).not.toHaveBeenCalled();
  });

  it('Deve lançar InternalServerErrorException se o banco de dados falhar no save', async () => {
    // Arrange
    const fakeRecipeDto: CreateRecipeDto = {
      name: 'shampoo',
      recipeIngredients: [],
    };

    mockRecipeRepository.findOneBy.mockResolvedValue(null);

    // mockRejectedValue: Usado para rejeitar funções assincronas
    mockRecipeRepository.save.mockRejectedValue(new Error('Database caiu'));

    const regexMessage = new RegExp(`Não foi possível criar a receita.`, 'i');

    await expect(provider.execute(fakeRecipeDto)).rejects.toThrow(regexMessage);
  });
});
