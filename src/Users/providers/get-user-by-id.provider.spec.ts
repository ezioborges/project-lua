import { Test, TestingModule } from '@nestjs/testing';
import { GetUserByIdProvider } from './get-user-by-id.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('GetUserByIdProvider', () => {
  let provider: GetUserByIdProvider;

  const mockUserRepository = {
    findOneBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetUserByIdProvider,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    provider = module.get<GetUserByIdProvider>(GetUserByIdProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('o provider deve FindCategoryByIdProvider deve estar definido', async () => {
    expect(provider).toBeDefined();
  });

  it('Deve retornar o usuário correto através do ID', async () => {
    const userId = '123';
    const user = { id: userId, name: 'fornecedor' };

    mockUserRepository.findOneBy.mockResolvedValue(user);

    const result = await provider.execute(userId);

    expect(result).toEqual(user);

    expect(mockUserRepository.findOneBy).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
      id: userId,
    });
  });

  it('Deve lançar um erro NotFoundException se o usuário não existir', async () => {
    mockUserRepository.findOneBy.mockResolvedValue(null);

    const errorMessage = new RegExp(
      `Nenhum usuário encontrado com o ID: id-inexistente`,
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

    mockUserRepository.findOneBy.mockRejectedValue(errorContent);

    const errorMessage = new RegExp(
      `Erro ao buscar usuário pelo ID: ${errorContent.message}`,
    );

    const result = provider.execute('123');

    expect(result).rejects.toThrow(errorMessage);
    expect(result).rejects.toThrow(InternalServerErrorException);
  });
});
