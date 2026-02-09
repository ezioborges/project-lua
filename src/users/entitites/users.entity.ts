import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  // além de estipular como chave única da pra colocar também o tamnha de caracteres.
  @Column({ unique: true, length: 11 })
  cpf: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password', select: false }) // evita que a senha seja exposta
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
