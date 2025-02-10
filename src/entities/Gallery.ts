import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm'
import { Services } from './Services'

@Entity()
export class Gallery {
  @PrimaryGeneratedColumn('uuid')
  uid!: string

  @Column('text')
  imageUrl!: string

  @ManyToMany(() => Services, (services) => services.gallery)
  @JoinTable()
  services!: Services[]
}