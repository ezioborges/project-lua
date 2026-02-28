import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from '../entities/suppliers.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindAllSuppliersProvider {
  constructor(
    @InjectRepository(Supplier)
    private suppliersRepository: Repository<Supplier>,
  ) {}

  public async execute(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [suppliers, total] = await this.suppliersRepository.findAndCount({
        take: limit,
        skip,
        order: {
          createdAt: 'DESC',
        },
      });

      if (!suppliers || total === 0) {
        throw new NotFoundException(
          `Nenhum fornecedor encontrado ou cadastrado`,
        );
      }

      return {
        data: suppliers,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao buscar os fornecedores: ${error.message}`,
      );
    }
  }
}
