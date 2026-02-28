import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { CreateProductProvider } from '../providers/create-product.provider';

@Injectable()
export class ProductsService {
  constructor(private readonly createProductProvider: CreateProductProvider) {}

  create(createProductDto: CreateProductDto) {
    return this.createProductProvider.execute(createProductDto);
  }
}
