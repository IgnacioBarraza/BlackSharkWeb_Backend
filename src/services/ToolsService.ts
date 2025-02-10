import { In } from 'typeorm'
import { AppDataSource } from '../config/data-source'
import { Tools } from '../entities/Tools'

export class ToolsService {
  private toolsRepository = AppDataSource.getRepository(Tools)

  async getTools(): Promise<Tools[] | null> {
    return this.toolsRepository.find({
      relations: {
        services: true
      }
    })
  }

  async getToolById(id: string): Promise<Tools | null> {
    return this.toolsRepository.findOne({ where: { uid: id },
      relations: {
        services: true
      }
    })
  }

  async createTool(tool: Partial<Tools>): Promise<Tools> {
    return this.toolsRepository.save(tool)
  }

  async updateTool(id: string, tool: Partial<Tools>): Promise<Tools | null> {
    const toolToUpdate = await this.toolsRepository.findOne({ where: { uid: id }, 
      relations: {
        services: true
      }
    })
    if (!toolToUpdate) return null

    const existingServices = toolToUpdate.services || []
    const newServices = tool.services || []
    const servicesMap = new Map()
    existingServices.forEach(service => servicesMap.set(service.uid, service))
    newServices.forEach(service => servicesMap.set(service.uid, service))
    const mergedServices = Array.from(servicesMap.values())

    return this.toolsRepository.save({ ...toolToUpdate, ...tool, services: mergedServices })
  }

  async deleteTool(id: string): Promise<boolean> {
    const toolToDelete = await this.toolsRepository.findOneBy({ uid: id })
    if (!toolToDelete) return false

    await this.toolsRepository.delete(toolToDelete)
    return true
  }

  async getToolsByIds(toolsIds: string[]): Promise<Tools[]> {
    return this.toolsRepository.findBy({ uid: In(toolsIds)})
  }
}