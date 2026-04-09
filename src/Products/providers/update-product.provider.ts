import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity';
import { Repository } from 'typeorm';
import { UpdateProductDto } from '../dto/update-product.dto';

@Injectable()
export class UpdateProductProvider {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  public async execute(productId: string, updateProductDto: UpdateProductDto) {
    try {
      const productToUpdate = await this.productRepository.findOneBy({
        id: productId,
      });

      if (!productToUpdate) {
        throw new NotFoundException(
          `Produto não encontrado com o ID: ${productId}`,
        );
      }

      const updatedProduct = this.productRepository.merge(productToUpdate, {
        ...updateProductDto,
      });

      return await this.productRepository.save(updatedProduct);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new InternalServerErrorException(
        `Erro ao atualizar produto: ${error.message}`,
      );
    }
  }
}
