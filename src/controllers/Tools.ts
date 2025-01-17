import { Request, Response, NextFunction } from 'express'
import { sendResponse } from '../utils/utils'
import { ToolsService } from '../services/Tools'
import { CustomError } from '../middleware/errorHandler'
import { ZodError } from 'zod'
import { ToolsDto } from '../dtos/Tools'
import { ServicesService } from '../services/Services'

export class ToolsController {
  private toolsService: ToolsService
  private servicesService: ServicesService

  constructor() {
    this.toolsService = new ToolsService()
    this.servicesService = new ServicesService()
  }

  async getTools(req: Request, res: Response, next: NextFunction) {
    try {
      const tools = await this.toolsService.getTools()
      sendResponse(req, res, tools, 200)
    } catch (error) {
      next(new CustomError('Error getting tools', 500, error))
    }
  }

  async getToolById(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.params
      const tool = await this.toolsService.getToolById(uid)
      if (!tool) return next(new CustomError('Tool not found', 404))
      sendResponse(req, res, tool, 200)
    } catch (error) {
      next(new CustomError('Error getting tool', 500, error))
    }
  }

  async createTool(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = ToolsDto.parse(req.body)

      const services = await Promise.all(
        parsedData.services.map(async (serviceId) => {
          const service = await this.servicesService.getServiceById(serviceId)
          if (!service) {
            throw new CustomError(`Service with ID ${serviceId} not found`, 404)
          }
          return service
        })
      )

      if (services.some((service) => !service))
        return next(new CustomError('One or more services not found', 404))

      const newToolData = {
        name: parsedData.name,
        description: parsedData.description,
        type: parsedData.type,
        imageUrl: parsedData.imageUrl,
        services: services.filter((service) => service),
      }

      const newTool = await this.toolsService.createTool({ ...newToolData })
      sendResponse(req, res, newTool, 201)
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new CustomError('Validation error', 400, [error]))
      }
      next(new CustomError('Error creating tool', 500, [error]))
    }
  }

  async updateTool(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.params
      const existingTool = await this.toolsService.getToolById(uid)
      if (!existingTool) return next(new CustomError('Tool not found', 404))

      const parsedData = ToolsDto.partial().parse(req.body)

      const services = parsedData.services
        ? await Promise.all(
            parsedData.services.map(async (serviceId) => {
              const service = await this.servicesService.getServiceById(serviceId)
              if (!service) {
                throw new CustomError(
                  `Service with ID ${serviceId} not found`,
                  404
                )
              }
              return service
            })
          )
        : []

      if (services.length > 0 && services.some((service) => !service))
        return next(new CustomError('One or more services not found', 404))

      const updatedData = {
        uid: uid,
        name: parsedData.name ?? existingTool.name,
        description: parsedData.description ?? existingTool.description,
        type: parsedData.type ?? existingTool.type,
        imageUrl: parsedData.imageUrl ?? existingTool.imageUrl,
        services: services.filter((service) => service),
      }

      const updatedTool = await this.toolsService.updateTool(uid, updatedData)

      if (!updatedTool) {
        return next(new CustomError('Tool not found', 404))
      }
      sendResponse(req, res, updatedTool, 200)
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new CustomError('Validation error', 400, [error]))
      }
      next(new CustomError('Error updating tool', 500, [error]))
    }
  }

  async deleteTool(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.params
      const deleted = await this.toolsService.deleteTool(uid)
      if (!deleted) return next(new CustomError('Tool not found', 404))
      sendResponse(req, res, 'Tool deleted', 204)
    } catch (error) {
      next(new CustomError('Error deleting tool', 500, [error]))
    }
  }
}
