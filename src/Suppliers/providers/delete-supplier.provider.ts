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
export class DeleteSupplierProvider {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  public async execute(supplierId: string) {
    try {
      const supplierToDelete = await this.supplierRepository.findOneBy({
        id: supplierId,
      });
      if (!supplierToDelete) {
        throw new NotFoundException(
          `Nenhum forncedor encontrado com o ID: ${supplierId}`,
        );
      }

      return await this.supplierRepository.softDelete(supplierToDelete.id);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Erro ao deletar fornecedor: ${error.message}`,
      );
    }
  }
}
