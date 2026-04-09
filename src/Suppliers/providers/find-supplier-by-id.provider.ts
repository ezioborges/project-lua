import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from '../entities/suppliers.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindSupplierByIdProvider {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  public async execute(supplierId: string): Promise<Supplier> {
    try {
      const supplier = await this.supplierRepository.findOneBy({
        id: supplierId,
      });

      if (!supplier) {
        throw new NotFoundException(
          `Nenhum fornecedor encontrado com o ID: ${supplierId}`,
        );
      }

      return supplier;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Nenhum fornecedor encontrado: ${error.message}`,
      );
    }
  }
}
