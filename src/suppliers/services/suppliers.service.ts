import { Injectable } from '@nestjs/common';
import { CreateSupplierProvider } from '../providers/create-supplier.provider';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';

@Injectable()
export class SupplierService {
  constructor(
    private readonly createSupplierProvider: CreateSupplierProvider,
  ) {}

  async create(createSupplierDto: CreateCategoryDto) {
    return await this.createSupplierProvider.execute(createSupplierDto);
  }
}
