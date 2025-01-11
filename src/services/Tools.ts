import { AppDataSource } from '../config/data-source'
import { Tools } from '../entities/Tools'

export class ToolsService {
  private toolsRepository = AppDataSource.getRepository(Tools)

  async getTools(): Promise<Tools[] | null> {
    return this.toolsRepository.find()
  }

  async getToolById(id: string): Promise<Tools | null> {
    return this.toolsRepository.findOneBy({ uid: id })
  }

  async createTool(tool: Tools): Promise<Tools> {
    return this.toolsRepository.save(tool)
  }

  async updateTool(id: string, tool: Partial<Tools>): Promise<Tools | null> {
    const toolToUpdate = await this.toolsRepository.findOneBy({ uid: id })
    if (!toolToUpdate) return null

    return this.toolsRepository.save({ ...toolToUpdate, ...tool })
  }

  async deleteTool(id: string): Promise<boolean> {
    const toolToDelete = await this.toolsRepository.findOneBy({ uid: id })
    if (!toolToDelete) return false

    await this.toolsRepository.delete(toolToDelete)
    return true
  }
}