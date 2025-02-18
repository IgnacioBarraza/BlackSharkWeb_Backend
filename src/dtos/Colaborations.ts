import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { Services } from './Services'

@Entity()
export class Colaborations {
  @PrimaryGeneratedColumn('uuid')
  uid!: string

  @Column()
  title!: string

  @Column()
  description!: string

  @Column('text')
  imageUrl!: string

  @ManyToMany(() => Services, services => services.colaborations)
  @JoinTable()
  services!: Services[]
}
