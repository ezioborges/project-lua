import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { FindUserByEmailProvider } from './find-user-by-email';

describe('FindUserByEmailProvider', () => {
  let provider: FindUserByEmailProvider;

  const queryBuilderMock = {
    where: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockUserRepository = {
    createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByEmailProvider,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    provider = module.get<FindUserByEmailProvider>(FindUserByEmailProvider);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(provider).toBeDefined();
  });

  it('deve retornar o usuário quando encontrar por email', async () => {
    const email = 'teste@email.com';
    const user = { id: '1', email, password: 'hash' } as User;

    queryBuilderMock.getOne.mockResolvedValue(user);

    const result = await provider.execute(email);

    expect(mockUserRepository.createQueryBuilder).toHaveBeenCalledWith('user');
    expect(queryBuilderMock.where).toHaveBeenCalledWith('user.email = :email', {
      email,
    });
    expect(queryBuilderMock.addSelect).toHaveBeenCalledWith('user.password');
    expect(result).toEqual(user);
  });

  it('deve lançar NotFoundException quando não encontrar usuário', async () => {
    const email = 'naoexiste@email.com';
    queryBuilderMock.getOne.mockResolvedValue(null);

    await expect(provider.execute(email)).rejects.toThrow(NotFoundException);
    await expect(provider.execute(email)).rejects.toThrow(
      `Nenhum usuário encontrado com o email: ${email}`,
    );
  });

  it('deve propagar erro inesperado do repositório', async () => {
    const email = 'erro@email.com';
    const infraError = new Error('Falha no banco');

    queryBuilderMock.getOne.mockRejectedValue(infraError);

    await expect(provider.execute(email)).rejects.toThrow('Falha no banco');
  });
});
