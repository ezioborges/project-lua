import { Test, TestingModule } from '@nestjs/testing';
import { DeleteUserProvider } from './delete-user.provider';
import { User } from '../entities/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('DeleteSupplierProvider', () => {
  let provider: DeleteUserProvider;

  const mockUserRepository = {
    findOne: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserProvider,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    provider = module.get<DeleteUserProvider>(DeleteUserProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('Testa se o provider DeleteProductProvider está definido', () => {
    expect(provider).toBeDefined();
  });

  it('Testa se o usuário é deletado com sucesso', async () => {
    const userId = '123';
    const fakeUser = {
      id: userId,
      name: 'fornecedor',
    };

    const mockDeletedResult = {
      affected: 1,
      raw: [],
      generatedMaps: [],
    };

    mockUserRepository.findOne.mockResolvedValue(fakeUser);
    mockUserRepository.softDelete.mockResolvedValue(mockDeletedResult);

    const result = await provider.execute(fakeUser.id);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { id: fakeUser.id },
    });

    expect(mockUserRepository.softDelete).toHaveBeenCalledWith(userId);

    expect(result).toEqual(mockDeletedResult);
  });

  it('Deve lançar NotFoundException se não encontrar um fornecedor para deletar', async () => {
    const userId = '123';

    mockUserRepository.findOne.mockResolvedValue(null);

    const errorMessage = new RegExp(
      `Usuário não encontrado ou já removido!`,
      'i',
    );

    await expect(provider.execute(userId)).rejects.toThrow(errorMessage);
    await expect(provider.execute(userId)).rejects.toThrow(NotFoundException);

    expect(mockUserRepository.softDelete).not.toHaveBeenCalled();
  });

  it('Deve lançar InternalServerError em caso de erro no banco de dados', async () => {
    const userId = '123';
    const fakesupplier = {
      id: userId,
      name: 'cliente',
    };

    const errorException = new Error('Falha de conexão');

    mockUserRepository.findOne.mockResolvedValue(fakesupplier);
    mockUserRepository.softDelete.mockRejectedValue(errorException);

    const errorMessage = new RegExp(
      `Erro ao deletar o usuário: ${errorException.message}`,
      'i',
    );

    const result = provider.execute(userId);

    await expect(result).rejects.toThrow(errorMessage);
    await expect(result).rejects.toThrow(InternalServerErrorException);

    expect(mockUserRepository.findOne).toHaveBeenCalled();
    expect(mockUserRepository.softDelete).toHaveBeenCalledWith(userId);
  });
});
