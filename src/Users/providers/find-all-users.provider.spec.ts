import { Test, TestingModule } from '@nestjs/testing';
import { FindAllUsersProvider } from './find-all-users.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('FindAllUsersProvider', () => {
  let provider: FindAllUsersProvider;

  const mockUserRepository = {
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindAllUsersProvider,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    provider = module.get<FindAllUsersProvider>(FindAllUsersProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('Testas e o provider de FindAllUsersProvider deve estar definido', async () => {
    expect(provider).toBeDefined();
  });

  it('Deve listar todas os usuários usando paginação e limite', async () => {
    const users = [
      { id: '1', name: 'cliente 1' },
      { id: '2', name: 'cliente 2' },
    ];

    const mockTotal = 2;

    mockUserRepository.findAndCount.mockResolvedValue([users, mockTotal]);

    const result = await provider.execute();

    expect(mockUserRepository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 10,
        skip: 0,
      }),
    );

    expect(result).toEqual({
      users,
      meta: {
        total: mockTotal,
        page: 1,
        lastPage: 1,
      },
    });
  });

  it('Deve calcular corretamente o skip e a lastPage para paginação customizada', async () => {
    const users = [{ id: '1', name: 'shampoo' }];
    const mockTotal = 12;

    mockUserRepository.findAndCount.mockResolvedValue([users, mockTotal]);

    const result = await provider.execute(2, 5);

    expect(mockUserRepository.findAndCount).toHaveBeenCalledWith(
      expect.objectContaining({
        take: 5,
        skip: 5,
      }),
    );

    expect(result.meta).toEqual({
      total: mockTotal,
      page: 2,
      lastPage: 3,
    });
  });

  it('Deve lançar o erro InternalServerException', async () => {
    const errorTest = new Error(`Falha na conexão`);
    mockUserRepository.findAndCount.mockRejectedValue(errorTest);

    const errorMessage = new RegExp(
      `Erro ao buscar todos os usuários: ${errorTest.message}`,
      'i',
    );

    await expect(provider.execute()).rejects.toThrow(
      InternalServerErrorException,
    );
    await expect(provider.execute()).rejects.toThrow(errorMessage);
  });
});
