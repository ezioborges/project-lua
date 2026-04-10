import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { SupplierService } from '../services/suppliers.service';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Suppliers')
@Controller('suppliers')
export class SupllierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createSupplierDto: CreateSupplierDto) {
    const newSupplier = await this.supplierService.create(createSupplierDto);

    return {
      status: 'success',
      message: 'Fornecedor criado com sucesso',
      data: newSupplier,
    };
  }

  @Get()
  @HttpCode(200)
  async findAll(page: number, limit: number) {
    const allSuppliers = await this.supplierService.findAll(page, limit);

    return {
      status: 'success',
      messagem: 'Lista de Fornecedores',
      allSuppliers,
    };
  }

  @Get(':supplierId')
  @HttpCode(200)
  async findById(@Param('supplierId', new ParseUUIDPipe()) supplierId: string) {
    const supplier = await this.supplierService.findById(supplierId);

    return {
      status: 'success',
      message: 'Fornecedor encontrado com sucesso',
      supplier,
    };
  }

  @Put(':supplierId')
  @HttpCode(200)
  async update(
    @Param('supplierId', new ParseUUIDPipe()) supplierId: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    const updatedSupplier = await this.supplierService.update(
      supplierId,
      updateSupplierDto,
    );

    return {
      status: 'success',
      message: 'Fornecedor atualizado com sucesso',
      updatedSupplier,
    };
  }

  @Delete(':supplierId')
  @HttpCode(200)
  async delete(@Param('supplierId', new ParseUUIDPipe()) supplierId: string) {
    await this.supplierService.delete(supplierId);

    return {
      status: 'success',
      message: 'Fornecedor excluído com sucesso',
    };
  }

  @Patch(':supplierId/restore')
  @HttpCode(200)
  async restore(@Param('supplierId', new ParseUUIDPipe()) supplierId: string) {
    await this.supplierService.restore(supplierId);

    return {
      status: 'success',
      message: 'Fornecedor restaurado com sucesso',
    };
  }
}
