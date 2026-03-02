import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/products.entity';
import { ProductsController } from './controllers/products.controller';
import { CreateProductProvider } from './providers/create-product.provider';
import { ProductsService } from './services/product.service';
import { Category } from 'src/Categories/entities/category.entity';
import { Supplier } from 'src/Suppliers/entities/suppliers.entity';
import { FindAllProductsProvider } from './providers/find-all-products.provider';
import { FindProductByIdProvider } from './providers/find-product-by-id.provider';
import { UpdateProductProvider } from './providers/update-product.provider';
import { DeleteProductProvider } from './providers/delete-product.provider';
import { RestoreProductProvider } from './providers/restore-product.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Supplier])],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    CreateProductProvider,
    FindAllProductsProvider,
    FindProductByIdProvider,
    UpdateProductProvider,
    DeleteProductProvider,
    RestoreProductProvider,
  ],
  exports: [
    CreateProductProvider,
    FindAllProductsProvider,
    FindProductByIdProvider,
    UpdateProductProvider,
    DeleteProductProvider,
    RestoreProductProvider,
  ],
})
export class ProductsModule {}
