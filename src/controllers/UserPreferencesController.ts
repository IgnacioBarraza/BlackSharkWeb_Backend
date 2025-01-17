import { NextFunction, Request, Response } from 'express'
import { UserPreferencesService } from '../services/UserPreferencesService'
import { sendResponse } from '../utils/utils'
import { CustomError } from '../middleware/errorHandler'
import { ZodError } from 'zod'
import { UserPreferencesDto } from '../dtos/UserPreferences'

export class UserPreferencesController {
  private userPreferencesService: UserPreferencesService;

  constructor() {
    this.userPreferencesService = new UserPreferencesService();
  }

  async getUserPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.params
      const preferences = await this.userPreferencesService.getUserPreferencesById(uid)
      sendResponse(req, res, { preferences }, 200)
    } catch (error) {
      next(new CustomError('Error fetching user preferences', 500, [error]))
    }
  }

  async updateUserPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const { uid } = req.params
      const existingPreferences = await this.userPreferencesService.getUserPreferencesById(uid)
      if (!existingPreferences) return next(new CustomError('User preferences not found', 404))

      const preferencesData = UserPreferencesDto.partial().parse(req.body)
      const updatedPreferences = await this.userPreferencesService.updateUserPreferences(uid, preferencesData)
      sendResponse(req, res, { updatedPreferences }, 200)
    } catch (error) {
      if (error instanceof ZodError) return next(new CustomError('Validation error', 400, [error]))
      next(new CustomError('Error updating user preferences', 500, error))
    }
  }

  async deleteUserPreferences(req: Request, res: Response, next: NextFunction) {
    const { uid } = req.params
    try {
      const existingPreferences = await this.userPreferencesService.getUserPreferencesById(uid)
      if (!existingPreferences) return next(new CustomError('User preferences not found', 404, ['User preferences not found']))

      const defaultPreferences = {
        theme: 'light',
        notificationsEnabled: false,
        lang: 'en',
        notificationsType: ''
      }

      const updatedPreferences = await this.userPreferencesService.updateUserPreferences(uid, defaultPreferences)
      sendResponse(req, res, updatedPreferences, 200)
    } catch (error) {
      next(new CustomError('Error deleting user preferences', 500, error))
    }
  }
}