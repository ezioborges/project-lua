import {
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from '../entities/suppliers.entity';
import { Repository } from 'typeorm';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';

@Injectable()
export class UpdateSupplierProvider {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  public async execute(
    supplierId: string,
    updateSupplierDto: UpdateSupplierDto,
  ) {
    try {
      const supplier = await this.supplierRepository.findOne({
        where: {
          // No caso do update é melhor usar o 'FindOne', por que depois posso querer buscar por outros atributos.
          id: supplierId,
        },
      });

      if (!supplier) {
        throw new NotFoundException(
          `Nenhum fornecedor encontrado com o ID: ${supplierId}`,
        );
      }

      const updatedSupplier = this.supplierRepository.merge(supplier, {
        ...updateSupplierDto,
      });

      return await this.supplierRepository.save(updatedSupplier);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(`Já existe um fornecedor com o nome.`);
      }
      throw new InternalServerErrorException(
        `Erro na busca por fornecedores: ${error.message}`,
      );
    }
  }
}
