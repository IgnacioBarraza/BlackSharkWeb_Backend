import { DataSource } from 'typeorm'
import { config } from 'dotenv'

config()

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: DB_HOST,
  port: parseInt(DB_PORT || '3306', 10),
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  synchronize: true,
  logging: false,
  entities: ['src/dtos/*.ts'],
})

export const initializeDataSource = async () => {
  await AppDataSource.initialize()
}