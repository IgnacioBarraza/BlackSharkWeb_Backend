import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'
import { Services } from './Services'

@Entity()
export class Tools {
  @PrimaryGeneratedColumn('uuid')
  uid!: string;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  type!: string;

  @Column()
  imageUrl!: string;

  @ManyToMany(() => Services, (service) => service.uid)
  services!: Services[]
}