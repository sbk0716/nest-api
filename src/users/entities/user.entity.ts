import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Schema, Table } from '../../configs/database';

@Entity({ schema: Schema.private, name: Table.user })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, unique: false })
  firstName: string;

  @Column({ nullable: false, unique: false })
  lastName: string;

  @Column({ nullable: false, unique: false })
  firstNameKana: string;

  @Column({ nullable: false, unique: false })
  lastNameKana: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
