import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/products.entity';
import { CreateProductDto } from '../dto/create-product.dto';

@Injectable()
export class CreateProductProvider {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async execute(createProductDto: CreateProductDto) {
    try {
      const newProduct = this.productRepository.create({
        ...createProductDto,
        // Garanta que o nome do campo aqui seja EXATAMENTE o que está na sua entidade
        category: { id: createProductDto.categoryId },
        // Usamos 'undefined' para campos opcionais
        supplier: createProductDto.supplierId
          ? { id: createProductDto.supplierId }
          : undefined,
      });

      return await this.productRepository.save(newProduct);
    } catch (error) {
      // peguei o código do erro de duplicidade no proprio terminal
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException(
          'Já existe um produto cadastrado com este código (sku)',
        );
      }

      throw new InternalServerErrorException(
        `Erro ao salvar o produto no banco de dados: ${error.message}`,
      );
    }
  }
}
