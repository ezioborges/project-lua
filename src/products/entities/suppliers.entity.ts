import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './products.entity';

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
