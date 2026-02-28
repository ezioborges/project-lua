import { Injectable } from '@nestjs/common';
import { CreateSupplierProvider } from '../providers/create-supplier.provider';
import { CreateCategoryDto } from 'src/Categories/dto/create-category.dto';
import { FindAllSuppliersProvider } from '../providers/find-all-suppliers.provider';
import { FindSupplierByIdProvider } from '../providers/find-supplier-by-id.provider';
import { UpdateSupplierProvider } from '../providers/update-supplier.provider';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { DeleteSupplierProvider } from '../providers/delete-supplier.provider';

@Injectable()
export class SupplierService {
  constructor(
    private readonly createSupplierProvider: CreateSupplierProvider,
    private readonly findAllSuppliersProvider: FindAllSuppliersProvider,
    private readonly findSupplierByIdProvider: FindSupplierByIdProvider,
    private readonly updateSupplierProvider: UpdateSupplierProvider,
    private readonly deleteSupplierProvider: DeleteSupplierProvider,
  ) {}

  async create(createSupplierDto: CreateCategoryDto) {
    return await this.createSupplierProvider.execute(createSupplierDto);
  }

  async findAll(page: number, limit: number) {
    return await this.findAllSuppliersProvider.execute(page, limit);
  }

  async findById(supplierId: string) {
    return await this.findSupplierByIdProvider.execute(supplierId);
  }

  async update(supplierId: string, updateSupplierDto: UpdateSupplierDto) {
    return await this.updateSupplierProvider.execute(
      supplierId,
      updateSupplierDto,
    );
  }

  async delete(supplierId: string) {
    return await this.deleteSupplierProvider.execute(supplierId);
  }
}
