import { AppDataSource } from '../config/data-source'
import { User } from '../dtos/User'

export class UserService {
  private userRepository = AppDataSource.getRepository(User)

  async getUsers(): Promise<User[] | null> {
    return this.userRepository.find({
      relations: {
        userPreferences: true
      }
    })
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findOne({ where: {uid: id}, 
      relations: {
        userPreferences: true
      }
    })
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email }, 
      relations: {
        userPreferences: true
      }
    });
  }

  async createUser(user:Partial<User>): Promise<User> {
    return this.userRepository.save(user)
  }

  async updateUser(id: string, user: Partial<User>): Promise<User | null> {
    const userToUpdate = await this.userRepository.findOne({ where: {uid: id} })
    if (!userToUpdate) return null

    return this.userRepository.save({ ...userToUpdate, ...user })
  }

  async deleteUser(id: string): Promise<boolean> {
    const userToDelete = await this.userRepository.findOne({ where: {uid: id} })
    if (!userToDelete) return false

    await this.userRepository.delete(userToDelete)
    return true
  }
}