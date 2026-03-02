import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ProductsService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';

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

  @Get()
  @HttpCode(200)
  async findAll(page: number, limit: number) {
    const allProducts = await this.productsService.findAll(page, limit);

    return {
      status: 'success',
      message: 'Lista de produtos',
      allProducts,
    };
  }

  @Get(':productId')
  @HttpCode(200)
  async findById(@Param('productId', new ParseUUIDPipe()) productId: string) {
    const product = await this.productsService.findById(productId);

    return {
      status: 'success',
      message: `Produto: ${product.name}`,
      product,
    };
  }

  @Put(':productId')
  @HttpCode(200)
  async update(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const updatedProduct = await this.productsService.update(
      productId,
      updateProductDto,
    );

    return {
      status: 'success',
      message: `Produto atualizado com sucesso`,
      updatedProduct,
    };
  }
}
