import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from '../entities/suppliers.entity';
import { Repository } from 'typeorm';
import { CreateSupplierDto } from '../dto/create-supplier.dto';

@Injectable()
export class CreateSupplierProvider {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  public async execute(createSupplierDto: CreateSupplierDto) {
    try {
      const newSupplier = this.supplierRepository.create(createSupplierDto);

      return await this.supplierRepository.save(newSupplier);
    } catch (error) {
      throw new InternalServerErrorException(
        `Erro ao criar Fornecedor: ${error.message}`,
      );
    }
  }
}
