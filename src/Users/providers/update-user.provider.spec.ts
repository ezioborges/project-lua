import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserProvider } from './update-user.provider';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/users.entity';
import { UserValidator } from '../services/user-validator.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('UpdateUserProvider', () => {
  let provider: UpdateUserProvider;

  const mockUserRepository = {
    findOne: jest.fn(),
    merge: jest.fn(),
    save: jest.fn(),
  };

  const mockuserValidator = {
    checkEmailAndCpf: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserProvider,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: UserValidator,
          useValue: mockuserValidator,
        },
      ],
    }).compile();

    provider = module.get<UpdateUserProvider>(UpdateUserProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('o provider UpdateSupplierProvider deve estar definido', async () => {
    expect(provider).toBeDefined();
  });

  it('Deve ser possível atualizar um fornecedor', async () => {
    const userId = '123';

    const updateUserDto: UpdateUserDto = { name: 'novo nome' };

    const userToEdit = { id: userId, name: 'nome antigo' };

    const mockUpdatedUser = {
      id: userId,
      name: 'novo nome',
    };

    mockUserRepository.findOne.mockResolvedValue(userToEdit);
    mockUserRepository.merge.mockReturnValue(mockUpdatedUser);
    mockUserRepository.save.mockResolvedValue(mockUpdatedUser);

    const result = await provider.execute(userId, updateUserDto);

    expect(mockUserRepository.findOne).toHaveBeenCalledWith({
      where: { id: userId },
    });

    expect(mockUserRepository.merge).toHaveBeenCalledWith(
      userToEdit,
      updateUserDto,
    );

    expect(mockUserRepository.save).toHaveBeenCalledWith(mockUpdatedUser);

    expect(result).toEqual({
      id: userId,
      name: 'novo nome',
    });
  });

  it('Deve lançar NotFoundException se o fornecedor não existir', async () => {
    const userId = 'inexistente';

    const updateUserDto: UpdateUserDto = {
      name: 'novo nome',
    };

    mockUserRepository.findOne.mockResolvedValue(null);

    const errorMessage = new RegExp(
      `Usuário não encontrado com o ID: ${userId}`,
      'i',
    );

    const result = provider.execute(userId, updateUserDto);

    await expect(result).rejects.toThrow(errorMessage);

    await expect(result).rejects.toThrow(NotFoundException);
  });

  it('Deve lançar InternalServerException se der erro no banco dados', async () => {
    const userId = '123';
    const updateDto: UpdateUserDto = { name: 'Teste' };
    const existingUser = { id: userId, name: 'Usuário antigo', cpf: '123' };
    const mergedUser = { ...existingUser, ...updateDto };

    const errorContent = new Error('Falha no banco de dados');

    mockUserRepository.findOne.mockResolvedValue(existingUser);
    mockuserValidator.checkEmailAndCpf.mockResolvedValue(existingUser.cpf);
    mockUserRepository.merge.mockReturnValue(mergedUser);

    mockUserRepository.save.mockRejectedValue(errorContent);

    const errorMessage = new RegExp(
      `Erro ao atualizar o usuário: ${errorContent.message}`,
    );

    const result = provider.execute(userId, updateDto);

    await expect(result).rejects.toThrow(errorMessage);

    await expect(result).rejects.toThrow(InternalServerErrorException);
  });
});
