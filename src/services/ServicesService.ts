import { AppDataSource } from '../config/data-source'
import { Services } from '../dtos/Services'
import { Tools } from '../dtos/Tools'
import { In } from 'typeorm'

export class ServicesService {
  private serviceRepository = AppDataSource.getRepository(Services)
  private toolsRepository = AppDataSource.getRepository(Tools)

  async getServices(): Promise<Services[] | null> {
    return this.serviceRepository.find({
      relations: {
        tools: true
      }
    })
  }

  async getServiceById(id: string): Promise<Services | null> {
    return this.serviceRepository.findOne({where: { uid: id }, relations: {
      tools: true
    }})
  }

  async createService(service: Partial<Services>): Promise<Services> {
    return this.serviceRepository.save(service)
  }

  async updateService(id: string, service: Partial<Services>): Promise<Services | null> {
    const serviceToUpdate = await this.serviceRepository.findOne({where: { uid: id } })
    if (!serviceToUpdate) return null

    return this.serviceRepository.save({ ...serviceToUpdate, ...service })
  }

  async deleteService(id: string): Promise<boolean> {
    const serviceToDelete = await this.serviceRepository.findOne({where: { uid: id } })
    if (!serviceToDelete) return false

    await this.serviceRepository.delete(serviceToDelete)
    return true
  }

  async getServicesByIds(serviceIds: string[]): Promise<Services[]> {
    return this.serviceRepository.findBy({ uid: In(serviceIds) })
  }
}