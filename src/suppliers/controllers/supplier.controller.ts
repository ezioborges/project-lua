import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { SupplierService } from '../services/suppliers.service';
import { CreateSupplierDto } from '../dto/create-supplier.dto';

@Controller('suppliers')
export class SupllierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    const newSupplier = await this.supplierService.create(createSupplierDto);

    return {
      status: 'success',
    };
  }
}
