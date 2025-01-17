import { NextFunction, Request, Response } from 'express'
import { sendResponse } from '../utils/utils'
import { ServicesService } from '../services/ServicesService'
import { CustomError } from '../middleware/errorHandler'
import { ServiceDto } from '../dtos/Services'
import { ZodError } from 'zod'
import { ToolsService } from '../services/ToolsService'

export class ServiceController {
  private servicesService: ServicesService
  private toolsService: ToolsService

  constructor() {
    this.servicesService = new ServicesService()
    this.toolsService = new ToolsService()
  }

  async getServices(req: Request, res: Response, next: NextFunction) {
    try {
      const services = await this.servicesService.getServices()
      sendResponse(req, res, services, 200)
    } catch (error) {
      next(new CustomError('Error getting services', 500, [error]))
    }
  }

  async getServiceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.params
      const service = await this.servicesService.getServiceById(uid)
      if (!service) return next(new CustomError('Service not found', 404))
      sendResponse(req, res, service, 200)
    } catch (error) {
      next(new CustomError('Error getting service', 500, [error]));
    }
  }

  async createService(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = ServiceDto.parse(req.body)
      const tools = parsedData.tools ? await this.servicesService.getToolsByIds(parsedData.tools) : []
      const toolsMap = new Map()
      tools.forEach(tool => toolsMap.set(tool.uid, tool))
      const parsedTools = Array.from(toolsMap.values())

      const newServiceData = {
        name: parsedData.name,
        description: parsedData.description,
        price: parsedData.price,
        imageUrl: parsedData.imageUrl,
        recommended: false,
        tools: parsedTools
      }
      const newService = await this.servicesService.createService(newServiceData)

      for (const tool of tools) {
        if (newService) tool.services = [...(tool.services || []), newService]
        await this.toolsService.updateTool(tool.uid, tool)
      }

      sendResponse(req, res, newService, 201)
    } catch (error) {
      if (error instanceof ZodError) return next(new CustomError('Validation error', 400, [error]))
      next(new CustomError('Error creating service', 500, [error]))
    }
  }

  async updateService(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.params
      const existingService = await this.servicesService.getServiceById(uid)
      if (!existingService) return next(new CustomError('Service not found', 404))

      const parsedData = ServiceDto.partial().parse(req.body);

      const updatedData = {
        name: parsedData.name ?? existingService.name,
        description: parsedData.description ?? existingService.description,
        price: parsedData.price ?? existingService.price,
        imageUrl: parsedData.imageUrl ?? existingService.imageUrl,
        recommended: parsedData.recommended ?? existingService.recommended,
        tools: parsedData.tools ? await this.servicesService.getToolsByIds(parsedData.tools) : existingService.tools
      }

      const updatedService = await this.servicesService.updateService(uid, updatedData)

      if (!updatedService) return next(new CustomError('Service not found', 404))

      sendResponse(req, res, updatedService, 200)
    } catch (error) {
      if (error instanceof ZodError) return next(new CustomError('Validation error', 400, [error]))
      next(new CustomError('Error updating service', 500, error))
    }
  }

  async deleteService(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.params
      const service = await this.servicesService.getServiceById(uid)
      if (!service) return next(new CustomError('Service not found', 404))

      const tools = await this.toolsService.getTools()
      if (!tools) return next(new CustomError('Tools not found', 500, ['Tools not found']))

      for (const tool of tools) {
        tool.services = tool.services.filter(s => s.uid !== uid)
        await this.toolsService.updateTool(tool.uid, tool)
      }

      const deleted = await this.servicesService.deleteService(uid)
      if (!deleted) return next(new CustomError('Service not found', 404))

      sendResponse(req, res, 'Service deleted', 200)
    } catch (error) {
      next(new CustomError('Error deleting service', 500, [error]))
    }
  }

  async addToolsToService(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.params;
      const existingService = await this.servicesService.getServiceById(uid);
      if (!existingService) return next(new CustomError('Service not found', 404));

      const parsedData = ServiceDto.partial().parse(req.body);
      const newTools = parsedData.tools ? await this.toolsService.getToolsByIds(parsedData.tools) : [];
      const existingTools = existingService.tools || [];

      // Merge existing tools with new tools, avoiding duplicates
      const toolsMap = new Map();
      existingTools.forEach(tool => toolsMap.set(tool.uid, tool));
      newTools.forEach(tool => toolsMap.set(tool.uid, tool));
      const mergedTools = Array.from(toolsMap.values());

      existingService.tools = mergedTools;
      const updatedService = await this.servicesService.updateService(uid, existingService);

      // Update tools to include the updated service
      for (const tool of mergedTools) {
        tool.services = tool.services ? [...tool.services.filter((s: { uid: string }) => s.uid !== uid), updatedService] : [updatedService];
        await this.toolsService.updateTool(tool.uid, tool);
      }

      if (!updatedService) return next(new CustomError('Service not found', 404));

      // Remove circular references before sending the response
      const responseService = {
        ...updatedService,
        tools: updatedService.tools.map(tool => ({
          ...tool,
          services: tool.services ? tool.services.map(service => service.uid) : [] // Only include service UIDs
        }))
      };

      sendResponse(req, res, responseService, 200);
    } catch (error) {
      if (error instanceof ZodError) return next(new CustomError('Validation error', 400, [error]));
      next(new CustomError('Error adding tools to service', 500, error));
    }
  }

  async removeToolFromService(req: Request, res: Response, next: NextFunction) {
    const { uid, toolId } = req.params;
    try {
      const existingService = await this.servicesService.getServiceById(uid);
      if (!existingService) return next(new CustomError('Service not found', 404));

      const tool = await this.toolsService.getToolById(toolId);
      if (!tool) return next(new CustomError('Tool not found', 404));

      // Remove the tool from the service
      existingService.tools = existingService.tools.filter(t => t.uid !== toolId);
      const updatedService = await this.servicesService.updateService(uid, existingService);

      // Remove the service from the tool
      tool.services = tool.services ? tool.services.filter(s => s.uid !== uid) : [];
      await this.toolsService.updateTool(tool.uid, tool);

      if (!updatedService) return next(new CustomError('Service not found', 404));

      // Remove circular references before sending the response
      const responseService = {
        ...updatedService,
        tools: updatedService.tools.map(tool => ({
          ...tool,
          services: tool.services ? tool.services.map(service => service.uid) : [] // Only include service UIDs
        }))
      };

      sendResponse(req, res, responseService, 200);
    } catch (error) {
      console.error(error);
      if (error instanceof ZodError) return next(new CustomError('Validation error', 400, [error]));
      next(new CustomError('Error removing tool from service', 500, error));
    }
  }
}