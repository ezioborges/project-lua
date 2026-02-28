import { Product } from 'src/products/entities/products.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('suppliers')
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  webSite: string;

  @OneToMany(() => Product, (product) => product.supplier)
  product: Product[];
}
