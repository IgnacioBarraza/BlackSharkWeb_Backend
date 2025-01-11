import { NextFunction, Request, Response } from 'express'
import { sendResponse } from '../utils/utils'
import { ServicesService } from '../services/Services'
import { CustomError } from '../middleware/errorHandler';
import { ServiceDto } from '../dtos/Services';
import { Tools } from '../entities/Tools';
import { ZodError } from 'zod';

const servicesService = new ServicesService()

export async function getServices(req: Request, res: Response, next: NextFunction) {
  try {
    const services = await servicesService.getServices()
    sendResponse(req, res, services, 200)
  } catch (error) {
    console.error(error)
    next(new CustomError('Error getting services', 500, [error]));
  }
}

export async function getServiceById(req: Request, res: Response, next: NextFunction) {
  try {
    const uid = req.params.id
    const service = await servicesService.getServiceById(uid)
    if (!service) return next(new CustomError('Service not found', 404))
    sendResponse(req, res, service, 200)
  } catch (error) {
    next(new CustomError('Error getting service', 500, [error]));
  }
}

export async function createService(req: Request, res: Response, next: NextFunction) {
  try {
    const parsedData = ServiceDto.parse(req.body)
    const tools = parsedData.tools ? parsedData.tools.map(tool => ({ name: tool } as Tools)) : []
    const newService = await servicesService.createService({ ...parsedData, tools })
    sendResponse(req, res, newService, 201)
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new CustomError('Validation error', 400, [error]));
    }
    next(new CustomError('Error creating service', 500, [error]));
  }
}

export async function updateService(req: Request, res: Response, next: NextFunction) {
  try {
    const uid = req.params.id
    const existingService = await servicesService.getServiceById(uid)
    if (!existingService) return next(new CustomError('Service not found', 404))

    const parsedData = ServiceDto.partial().parse(req.body);

    const updatedData = {
      uid: uid,
      name: parsedData.name ?? existingService.name,
      description: parsedData.description ?? existingService.description,
      price: parsedData.price ?? existingService.price,
      imageUrl: parsedData.imageUrl ?? existingService.imageUrl,
      recommended: parsedData.recommended ?? existingService.recommended,
      tools: parsedData.tools ? parsedData.tools.map(tool => ({ name: tool } as Tools)) : existingService.tools
    }

    const updatedService = await servicesService.updateService(uid, updatedData)

    if (!updatedService) {
      return next(new CustomError('Service not found', 404))
    }
    sendResponse(req, res, updatedService, 200)
  } catch (error) {
    if (error instanceof ZodError) {
      return next(new CustomError('Validation error', 400, [error]));
    }
    next(new CustomError('Error updating service', 500, [error]));
  }
}

export async function deleteService(req: Request, res: Response, next: NextFunction) {
  try {
    const uid = req.params.id
    const service = await servicesService.getServiceById(uid)
    if (!service) return next(new CustomError('Service not found', 404))

    const deleted = await servicesService.deleteService(uid)
    if (!deleted) {
      return next(new CustomError('Service not found', 404))
    }
    sendResponse(req, res, 'Service deleted', 200)
  } catch (error) {
    next(new CustomError('Error deleting service', 500, [error]));
  }
}