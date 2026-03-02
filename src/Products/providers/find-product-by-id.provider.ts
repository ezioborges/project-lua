import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindProductByIdProvider {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  public async execute(productId: string) {
    try {
      const product = await this.productRepository.findOneBy({ id: productId });

      if (!product) {
        throw new NotFoundException(
          `Produto n~çao encontrado com o ID: ${productId}`,
        );
      }
      return product;
    } catch (error) {
      throw new InternalServerErrorException(`Erro na busca por produto.`);
    }
  }
}
