import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ProductsService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createProductDto: CreateProductDto) {
    const newProduct = await this.productsService.create(createProductDto);

    return {
      status: 'success',
      message: 'Produto criado com sucesso',
      data: newProduct,
    };
  }
}
