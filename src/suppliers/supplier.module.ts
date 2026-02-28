import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Supplier } from './entities/suppliers.entity';
import { SupllierController } from './controllers/supplier.controller';
import { SupplierService } from './services/suppliers.service';
import { CreateSupplierProvider } from './providers/create-supplier.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Supplier])],
  controllers: [SupllierController],
  providers: [SupplierService, CreateSupplierProvider],
  exports: [SupplierService, CreateSupplierProvider],
})
export class SupplierModule {}
