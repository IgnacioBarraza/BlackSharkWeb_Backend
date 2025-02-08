import { AppDataSource } from "../config/data-source";
import { Colaborations } from "../entities/Colaborations";

export class ColaborationsService {
  private colabRepository = AppDataSource.getRepository(Colaborations)

  async getColaborations(): Promise<Colaborations[] | null> {
    return this.colabRepository.find({
      relations: {
        services: true
      }
    })
  }

  async getColaborationsById(uid: string): Promise<Colaborations | null> {
    return this.colabRepository.findOne({
      where: { uid: uid },
      relations: {
        services: true
      }
    })
  }

  async createColaborations(colab: Partial<Colaborations>): Promise<Colaborations> {
    return this.colabRepository.save(colab)
  }

  async updateColaboration(uid: string, colabUpdates: Partial<Colaborations>): Promise<Colaborations | null> {
    const colabToUpdate = await this.colabRepository.findOne({ where: { uid: uid }})
    if (!colabToUpdate) return null

    return this.colabRepository.save({ ...colabToUpdate, ...colabUpdates })
  }

  async deleteColaboration(uid: string): Promise<void> {
    await this.colabRepository.delete(uid)
  }
}