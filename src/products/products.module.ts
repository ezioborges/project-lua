import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/products.entity';
import { ProductsController } from './controllers/products.controller';
import { CreateProductProvider } from './providers/create-product.provider';
import { ProductsService } from './services/product.service';
import { Supplier } from './entities/suppliers.entity';
import { Category } from 'src/categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Supplier])],
  controllers: [ProductsController],
  providers: [ProductsService, CreateProductProvider],
  exports: [CreateProductProvider],
})
export class ProductsModule {}
