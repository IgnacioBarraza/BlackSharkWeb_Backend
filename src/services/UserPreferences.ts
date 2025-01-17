import { AppDataSource } from '../config/data-source'
import { UserPreferences } from '../entities/UserPreferences'

export class UserPreferencesService {
  private userPreferencesRepository = AppDataSource.getRepository(UserPreferences)

  async getUserPreferencesById(id: string): Promise<UserPreferences | null> {
    return this.userPreferencesRepository.findOne({ where: { uid: id },
      relations: {
        user: true
      } 
    })
  }

  async createDefaultUserPreferences(): Promise<UserPreferences> {
    const defaultPreferences = this.userPreferencesRepository.create({ 
      theme: 'light',
      lang: 'es',
      notificationsEnabled: false,
      notificationsType: ''
    })
    return this.userPreferencesRepository.save(defaultPreferences)
  }

  async updateUserPreferences(id: string, userPreferences: Partial<UserPreferences>): Promise<UserPreferences | null> {
    const userPreferencesToUpdate = await this.userPreferencesRepository.findOne({ where: { uid: id } })
    if (!userPreferencesToUpdate) return null

    return this.userPreferencesRepository.save({ ...userPreferencesToUpdate, ...userPreferences })
  }

  async deleteUserPreferences(id: string): Promise<boolean> {
    const userPreferencesToDelete = await this.userPreferencesRepository.findOne({ where: { uid: id } })
    if (!userPreferencesToDelete) return false

    await this.userPreferencesRepository.remove(userPreferencesToDelete)
    return true
  }
}