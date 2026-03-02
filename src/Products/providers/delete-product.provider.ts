import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteProductProvider {
  constructor(
    @InjectRepository(Product)
    private productRespository: Repository<Product>,
  ) {}

  public async execute(productId: string) {
    try {
      const product = await this.productRespository.findOneBy({
        id: productId,
      });

      if (!product) {
        throw new NotFoundException(
          `Produto não encontrado com o ID: ${productId}`,
        );
      }

      return await this.productRespository.softDelete(productId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Não foi possível deletar o produto: ${error.message}`,
      );
    }
  }
}
