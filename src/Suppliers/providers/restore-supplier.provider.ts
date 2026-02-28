import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Supplier } from '../entities/suppliers.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RestoreSupplierProvider {
  constructor(
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
  ) {}

  //TODO: Depois da pra pensar em fazer a busca pelo CNPJ (???)
  public async execute(supplierId: string) {
    try {
      return await this.supplierRepository.restore(supplierId);
    } catch (error) {
      throw new InternalServerErrorException(`Erro na busca do Fornecedor`);
    }
  }
}
