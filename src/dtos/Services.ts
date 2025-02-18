import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'
import { Tools } from './Tools';
import { Gallery } from './Gallery';
import { Colaborations } from './Colaborations';

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

  @Column('text')
  imageUrl!: string;

  @Column()
  recommended!: boolean;

  @ManyToMany(() => Tools, (tools) => tools.services)
  @JoinTable()
  tools!: Tools[]

  @ManyToMany(() => Gallery, (gallery) => gallery.services)
  gallery!: Gallery[]

  @ManyToMany(() => Colaborations, colab => colab.services)
  colaborations!: Colaborations[]
}