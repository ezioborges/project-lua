import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateIngredientProvider } from './create-ingredient.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Ingredient } from '../entities/ingredient.entity';
import { CreateIngredientDto } from '../dto/create-ingredient.dto';

describe('CreateIngredientProvider', () => {
  let provider: CreateIngredientProvider;

  const mockIngredientRespository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateIngredientProvider,
        {
          provide: getRepositoryToken(Ingredient),
          useValue: mockIngredientRespository,
        },
      ],
    }).compile();

    provider = module.get<CreateIngredientProvider>(CreateIngredientProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('O provider CreateCetagoryProvider deve estar definido', () => {
    expect(provider).toBeDefined();
  });

  it('Deve criar e salvar um ingrediente com sucesso', async () => {
    const fakeIngredientDto: CreateIngredientDto = {
      name: 'ingrediente da dto',
    };

    const mockSavedIngredient = { id: '123', name: 'ingrediente da dto' };

    mockIngredientRespository.findOneBy.mockResolvedValue(null);
    mockIngredientRespository.create.mockReturnValue(fakeIngredientDto);
    mockIngredientRespository.save.mockResolvedValue(mockSavedIngredient);

    const result = await provider.execute(fakeIngredientDto);

    expect(mockIngredientRespository.findOneBy).toHaveBeenCalledWith({
      name: fakeIngredientDto.name,
    });
    expect(mockIngredientRespository.create).toHaveBeenCalledWith(
      fakeIngredientDto,
    );
    expect(mockIngredientRespository.save).toHaveBeenCalled();
    expect(result).toEqual(mockSavedIngredient);
  });

  it('Deve lançar ConflictException se o ingrediente já existir', async () => {
    const fakeIngredientDto: CreateIngredientDto = { name: 'ingrediente' };

    mockIngredientRespository.findOneBy.mockResolvedValue({
      id: '1',
      name: 'ingrediente',
    });

    await expect(provider.execute(fakeIngredientDto)).rejects.toThrow(
      ConflictException,
    );

    expect(mockIngredientRespository.create).not.toHaveBeenCalled();
    expect(mockIngredientRespository.save).not.toHaveBeenCalled();
  });

  it('Deve lançar InternalServerErrorException se o banco de dados falhar', async () => {
    const fakeIngredientDto: CreateIngredientDto = { name: 'ingrediente' };

    mockIngredientRespository.findOneBy.mockResolvedValue(null);
    mockIngredientRespository.save.mockRejectedValue(
      new Error('Data base com erro'),
    );

    await expect(provider.execute(fakeIngredientDto)).rejects.toThrow(
      InternalServerErrorException,
    );

    expect(mockIngredientRespository.create).toHaveBeenCalledWith(
      fakeIngredientDto,
    );
    expect(mockIngredientRespository.save).toHaveBeenCalled();
  });
});
