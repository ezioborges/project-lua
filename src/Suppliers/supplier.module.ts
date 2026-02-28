import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/suppliers.entity';
import { SupllierController } from './controllers/supplier.controller';
import { SupplierService } from './services/suppliers.service';
import { CreateSupplierProvider } from './providers/create-supplier.provider';
import { FindAllSuppliersProvider } from './providers/find-all-suppliers.provider';
import { FindSupplierByIdProvider } from './providers/find-supplier-by-id.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  controllers: [SupllierController],
  providers: [
    SupplierService,
    CreateSupplierProvider,
    FindAllSuppliersProvider,
    FindSupplierByIdProvider,
  ],
  exports: [
    SupplierService,
    CreateSupplierProvider,
    FindAllSuppliersProvider,
    FindSupplierByIdProvider,
  ],
})
export class SupplierModule {}
