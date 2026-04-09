import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserProvider } from './create-users.provider';
import { User, UserRole } from '../entities/users.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { UserValidator } from '../services/user-validator.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { InternalServerErrorException } from '@nestjs/common';

describe('CreateUserProvider', () => {
  let provider: CreateUserProvider;

  const mockSupplierRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUserValidator = {
    checkEmailAndCpf: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserProvider,
        {
          provide: getRepositoryToken(User),
          useValue: mockSupplierRepository,
        },
        {
          provide: UserValidator,
          useValue: mockUserValidator,
        },
      ],
    }).compile();

    provider = module.get<CreateUserProvider>(CreateUserProvider);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('O provider de CreateUserProvider deve estar definido', () => {
    expect(provider).toBeDefined();
  });

  it('Deve criar e salvar um usuário com sucesso', async () => {
    const userDto: CreateUserDto = {
      name: 'user 1',
      email: 'user@test.com',
      cpf: '111.222.333-44',
      password: '123456',
      role: UserRole.CLIENT,
    };

    const savedUser = { id: '123', name: 'user 1' };
    const expectedUser = { id: '123', name: 'user 1' };

    mockSupplierRepository.create.mockReturnValue(userDto);
    mockSupplierRepository.save.mockResolvedValue(savedUser);

    const result = await provider.execute(userDto);

    expect(mockSupplierRepository.create).toHaveBeenCalled();

    expect(mockSupplierRepository.save).toHaveBeenCalled();
    expect(result).toEqual(expectedUser);
  });

  it('Deve lançar InternalServerErrorException se o banco de dados falhar no save', async () => {
    const userDto: CreateUserDto = {
      name: 'user 1',
      email: 'user@test.com',
      cpf: '111.222.333-44',
      password: '123456',
      role: UserRole.CLIENT,
    };

    const errorContent = new Error('Falha de conexão');

    mockUserValidator.checkEmailAndCpf();

    mockSupplierRepository.create.mockReturnValue(userDto);
    mockSupplierRepository.save.mockRejectedValue(errorContent);

    const regexMessage = new RegExp(
      `Erro ao criar o usuário: ${errorContent.message}`,
      'i',
    );

    const result = provider.execute(userDto);

    await expect(result).rejects.toThrow(InternalServerErrorException);
    await expect(result).rejects.toThrow(regexMessage);
  });
});
