import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RestoreProductProvider {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  public async execute(productId: string) {
    try {
      return this.productRepository.restore(productId);
    } catch (error) {
      throw new InternalServerErrorException(
        `Não foi posível restaurar o produto: ${error.message}`,
      );
    }
  }
}
