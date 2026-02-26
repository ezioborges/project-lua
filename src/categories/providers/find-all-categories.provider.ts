import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FindAllCategoriesProvider {
  constructor(
    @InjectRepository(Category)
    private readonly findAllCategoriesRepository: Repository<Category>,
  ) {}

  public async execute(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [categories, total] =
      await this.findAllCategoriesRepository.findAndCount({
        take: limit,
        skip,
        order: {
          createdAt: 'DESC',
        },
      });

    return {
      data: categories,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }
}
