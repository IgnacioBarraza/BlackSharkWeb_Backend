import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm'
import { User } from './User'

@Entity()
export class UserPreferences {
  @PrimaryGeneratedColumn('uuid')
  uid!: string

  @Column()
  theme!: string

  @Column()
  lang!: string

  @Column()
  notificationsEnabled!: boolean

  @Column()
  notificationsType!: string

  @OneToOne(() => User , (user) => user.userPreferences)
  user!: User
}