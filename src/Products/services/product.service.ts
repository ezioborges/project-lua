import { Injectable } from '@nestjs/common';
import { CreateProductDto } from '../dto/create-product.dto';
import { CreateProductProvider } from '../providers/create-product.provider';
import { FindAllProductsProvider } from '../providers/find-all-products.provider';
import { FindProductByIdProvider } from '../providers/find-product-by-id.provider';
import { UpdateProductDto } from '../dto/update-product.dto';
import { UpdateProductProvider } from '../providers/update-product.provider';
import { DeleteProductProvider } from '../providers/delete-product.provider';

@Injectable()
export class ProductsService {
  constructor(
    private readonly createProductProvider: CreateProductProvider,
    private readonly findAllProductsProvider: FindAllProductsProvider,
    private readonly findProductByIdProvider: FindProductByIdProvider,
    private readonly updateProductProvider: UpdateProductProvider,
    private readonly deleteProductProvider: DeleteProductProvider,
  ) {}

  create(createProductDto: CreateProductDto) {
    return this.createProductProvider.execute(createProductDto);
  }

  async findAll(page: number, limit: number) {
    return await this.findAllProductsProvider.execute(page, limit);
  }

  async findById(productId: string) {
    return await this.findProductByIdProvider.execute(productId);
  }

  async update(productId: string, updatePRoductDto: UpdateProductDto) {
    return await this.updateProductProvider.execute(
      productId,
      updatePRoductDto,
    );
  }

  async delete(productId: string) {
    return await this.deleteProductProvider.execute(productId);
  }
}
