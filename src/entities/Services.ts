import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'
import { Tools } from './Tools';

@Entity()
export class Services {
  @PrimaryGeneratedColumn('uuid')
  uid!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  price!: number;

  @Column()
  imageUrl!: string;

  @Column()
  recommended!: boolean;

  @ManyToMany(() => Tools, (tools) =>tools.uid)
  @JoinTable()
  tools!: Tools[]
}