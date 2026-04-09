import { Test, TestingModule } from '@nestjs/testing';
import { DeleteIngredientProvider } from './delete-ingredient.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('DeleteIngredientProvider', () => {
  let provider: DeleteIngredientProvider;

  const mockIngredientRepository = {
    findOneBy: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteIngredientProvider,
        {
          provide: getRepositoryToken(Ingredient),
          useValue: mockIngredientRepository,
        },
      ],
    }).compile();

    provider = module.get<DeleteIngredientProvider>(DeleteIngredientProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('Testa se o provider DeleteIngredientProvider está definido', () => {
    expect(provider).toBeDefined();
  });

  it('Testa se o ingrediente é deletada com sucesso', async () => {
    const ingredientId = '123';
    const fakeIngredient = { id: ingredientId, name: 'shampoo' };

    const mockDeletedResult = {
      affected: 1,
      raw: [],
      generatedMaps: [],
    };

    mockIngredientRepository.findOneBy.mockResolvedValue(fakeIngredient);
    mockIngredientRepository.softDelete.mockResolvedValue(mockDeletedResult);

    const result = await provider.execute(fakeIngredient.id);

    expect(mockIngredientRepository.findOneBy).toHaveBeenCalledWith({
      id: ingredientId,
    });

    expect(mockIngredientRepository.softDelete).toHaveBeenLastCalledWith(
      ingredientId,
    );

    expect(result).toEqual(mockDeletedResult);
  });

  it('Deve lançar ConflictException se não encontrar um ingrediente para deletar', async () => {
    const ingredienteId = '123';

    mockIngredientRepository.findOneBy.mockResolvedValue(null);

    const errorMessage = new RegExp(
      `Não foi possível encontrar o ingrediente com o ID: ${ingredienteId}`,
      'i',
    );

    await expect(provider.execute(ingredienteId)).rejects.toThrow(errorMessage);
    await expect(provider.execute(ingredienteId)).rejects.toThrow(
      ConflictException,
    );

    expect(mockIngredientRepository.softDelete).not.toHaveBeenCalled();
  });

  it('Deve lançar InternalServerError em caso de erro no banco de dados', async () => {
    const ingredientId = '123';
    const fakeIngredient = { id: ingredientId, name: 'shampoo' };

    const errorException = new Error('Falha de conexão');

    mockIngredientRepository.findOneBy.mockResolvedValue(fakeIngredient);
    mockIngredientRepository.softDelete.mockRejectedValue(errorException);

    const errorMessage = new RegExp(
      `Erro ao deletar ingrediente: ${errorException.message}`,
      'i',
    );

    await expect(provider.execute(ingredientId)).rejects.toThrow(errorMessage);
    await expect(provider.execute(ingredientId)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(mockIngredientRepository.findOneBy).toHaveBeenCalled();
    expect(mockIngredientRepository.softDelete).toHaveBeenCalledWith(
      ingredientId,
    );
  });
});
