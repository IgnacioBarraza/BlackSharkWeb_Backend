import { Request, Response, NextFunction } from 'express'
import { sendResponse } from '../utils/utils'
import { CustomError } from '../middleware/errorHandler'
import { ZodError } from 'zod'
import { GalleryService } from '../services/GalleryService'
import { ServicesService } from '../services/ServicesService'
import { GalleryDto } from '../validators/Gallery'

export class GalleryController {
  private galleryService: GalleryService
  private servicesService: ServicesService

  constructor() {
    this.galleryService = new GalleryService()
    this.servicesService = new ServicesService()
  }

  async getGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const gallery = await this.galleryService.getGallery()
      sendResponse(req, res, gallery, 200)
    } catch (error) {
      next(new CustomError('Error getting gallery', 500, error))
    }
  }

  async getGalleryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.params
      const gallery = await this.galleryService.getGalleryById(uid)
      if (!gallery) return next(new CustomError('Gallery not found', 404, ['Gallery not found']))

      sendResponse(req, res, gallery, 200)
    } catch (error) {
      next(new CustomError('Error getting gallery', 500, error));
    }
  }

  async createGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = GalleryDto.parse(req.body)

      const services = await Promise.all(
        parsedData.services.map(async (serviceUid) => {
          const service = await this.servicesService.getServiceById(serviceUid)
          if (!service) throw new CustomError(`Service with uid: ${serviceUid} not found`, 404, [`Service with uid: ${serviceUid} not found`])

          return service
        })
      )

      if (services.some((service) => !service)) return next(new CustomError('One or more services not found', 404))

      const newGalleryData = {
        imageUrl: parsedData.imageUrl,
        services: services
      }

      const newGallery = await this.galleryService.createGallery(newGalleryData)

      sendResponse(req, res, newGallery, 201)
    } catch (error) {
      if (error instanceof ZodError) return next(new CustomError('Validation error', 400, error))
      next(new CustomError('Error creating gallery', 500, error))
    }
  }

  async updateGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.params
      const existingGallery = await this.galleryService.getGalleryById(uid)
      if (!existingGallery) return next(new CustomError('Gallery not found', 404, ['Gallery not found']))

      const parsedData = GalleryDto.partial().parse(req.body)

      const updatedData = {
        imageUrl: parsedData.imageUrl ?? existingGallery.imageUrl,
        services: parsedData.services ? await this.servicesService.getServicesByIds(parsedData.services) : existingGallery.services
      }

      const updatedGallery = await this.galleryService.updateGallery(uid, updatedData)
      if (!updatedGallery) return next(new CustomError('Gallery not found and not updated', 404, ['Gallery not updated']))

      sendResponse(req, res, updatedGallery, 200)
    } catch (error) {
      if (error instanceof ZodError) return next(new CustomError('Validation error', 400, error))
        next(new CustomError('Error updating gallery', 500, error))
    }
  }

  async deleteGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.params
      const gallery = await this.galleryService.getGalleryById(uid)
      if (!gallery) return next(new CustomError('Gallery not found', 404, ['Gallery not found']))

      await this.galleryService.deleteGallery(uid)
      sendResponse(req, res, 'Gallery deleted', 200)
    } catch (error) {
      next(new CustomError('Error deleting gallery', 500, error))
    }
  }

  async addServicesToGallery(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.params
      const gallery = await this.galleryService.getGalleryById(uid)
      if (!gallery) return next(new CustomError('Gallery not found', 404, ['Gallery not found']))

      const parsedData = GalleryDto.partial().parse(req.body)
      const newServices = parsedData.services ? await this.servicesService.getServicesByIds(parsedData.services) : []
      const existingServices = gallery.services || []

      const servicesMap = new Map()
      existingServices.forEach(service => servicesMap.set(service.uid, service))
      newServices.forEach(service => servicesMap.set(service.uid, service))
      const mergedServices = Array.from(servicesMap.values())

      gallery.services = mergedServices
      const updatedGallery = await this.galleryService.updateGallery(uid, gallery)
      if (!updatedGallery) return next(new CustomError('Gallery not found', 404, ['Gallery not found']))

      sendResponse(req, res, updatedGallery, 200)
    } catch (error) {
      if (error instanceof ZodError) return next(new CustomError('Validation error', 400, error))
      next(new CustomError('Error adding services to gallery', 500, error))
    }
  }
}