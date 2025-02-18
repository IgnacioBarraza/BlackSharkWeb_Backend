import { Entity, PrimaryColumn, Column, OneToOne, JoinColumn } from 'typeorm'
import { UserPreferences } from './UserPreferences'

@Entity()
export class User {
  @PrimaryColumn('uuid')
  uid!: string

  @Column()
  userName!: string

  @Column()
  name!: string

  @Column()
  email!: string

  @Column()
  password!: string

  @Column()
  userRole!: string

  @Column()
  phone!: string

  @Column()
  emailVerified!: boolean

  @OneToOne(() => UserPreferences, (userPreferences) => userPreferences.uid)
  @JoinColumn()
  userPreferences!: UserPreferences
}