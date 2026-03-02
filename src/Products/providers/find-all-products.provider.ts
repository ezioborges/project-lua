import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entities/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindAllProductsProvider {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  public async execute(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [products, total] = await this.productRepository.findAndCount({
        take: limit,
        skip,
        order: {
          createdAt: 'DESC',
        },
      });

      return {
        data: products,
        meta: {
          total,
          page,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(
        `Não foi possível listar os produtos`,
      );
    }
  }
}
