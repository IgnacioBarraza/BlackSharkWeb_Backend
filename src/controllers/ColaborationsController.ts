import { NextFunction, Request, Response } from 'express'
import { ColaborationsService } from '../services/ColaborationService'
import { sendResponse } from '../utils/utils'
import { CustomError } from '../middleware/errorHandler'
import { ColaborationsDto } from '../dtos/Colaborations'
import { ServicesService } from '../services/ServicesService'
import { ZodError } from 'zod'
import { title } from 'process'

export class ColaborationController {
  private colabService: ColaborationsService
  private servicesService: ServicesService

  constructor() {
    this.colabService = new ColaborationsService()
    this.servicesService = new ServicesService()
  }

  async getColaborations(req: Request, res: Response, next: NextFunction) {
    try {
      const colaborations = await this.colabService.getColaborations()
      sendResponse(req, res, colaborations, 200)
    } catch (error) {
      next(new CustomError('Error retrieving colabs', 500, error))
    }
  }

  async getColaborationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.params
      const colaboration = await this.colabService.getColaborationsById(uid)

      if (!colaboration)
        return next(
          new CustomError('Colaboration not found', 404, [
            'Colaboration not found',
          ])
        )

      sendResponse(req, res, colaboration, 200)
    } catch (error) {
      next(new CustomError('Error retrieving colaboration', 500, error))
    }
  }

  async createColaboration(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = ColaborationsDto.parse(req.body)

      const services = await Promise.all(
        parsedData.services.map(async (serviceId) => {
          const service = await this.servicesService.getServiceById(serviceId)

          if (!service)
            throw new CustomError(`Service with ID ${serviceId} not found`, 404)

          return service
        })
      )

      if (services.some((service) => !service))
        return next(new CustomError('One or more services not found', 404))

      const newColabData = {
        title: parsedData.title,
        description: parsedData.description,
        imageUrl: parsedData.imageUrl,
        services: services.filter((service) => service)
      }

      const newColab = await this.colabService.createColaborations({
        ...newColabData,
      })
      sendResponse(req, res, newColab, 201)
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new CustomError('Validation error', 400, error))
      }
      next(new CustomError('Error creating colaborations', 500, error))
    }
  }

  async updateColaboration(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.params
      const existingColab = await this.colabService.getColaborationsById(uid)
      if (!existingColab) return next(new CustomError('Colaboration not found', 404))

      const parsedData = ColaborationsDto.partial().parse(req.body)

      const services = parsedData.services ? await Promise.all(
        parsedData.services.map(async (serviceId) => {
          const service = await this.servicesService.getServiceById(serviceId)

          if (!service)
            throw new CustomError(`Service with ID ${serviceId} not found`, 404)

          return service
        })
      ) : []

      if (services.length > 0 && services.some((service) => !service))
        return next(new CustomError('One or more services not found', 404))

      const updatedData = {
        uid: uid,
        title: parsedData.title ?? existingColab.title,
        description: parsedData.description ?? existingColab.description,
        imageUrl: parsedData.imageUrl ?? existingColab.imageUrl,
        services: services.filter((service) => service)
      }

      const updatedColab = await this.colabService.updateColaboration(uid, updatedData)

      if (!updatedColab) return next(new CustomError('Colaboration not found', 404))

      sendResponse(req, res, updatedColab, 200)
    } catch (error) {
      if (error instanceof ZodError) {
        return next(new CustomError('Validation error', 400, [error]))
      }
      next(new CustomError('Error updating colaboration', 500, error))
    }
  }

  async deleteColaboration(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.params
      await this.colabService.deleteColaboration(uid)

      sendResponse(req, res, 'Colaboration deleted', 204)
    } catch (error) {
      next(new CustomError('Error deleting colaboration', 500, error))
    }
  }
}
