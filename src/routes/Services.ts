import { Router } from 'express'
import { getServices, getServiceById, createService, updateService, deleteService } from '../controllers/Services'
import { validationMiddleware } from '../middleware/validationMiddleware'
import { ServiceDto } from '../dtos/Services'
import { authenticateToken, authorizeRole } from '../middleware/validateUser'

const servicesRouter = Router()

// Public routes
servicesRouter.get('/', getServices)
servicesRouter.get('/:id',getServiceById)

// Protected routes
servicesRouter.post('/', authenticateToken, authorizeRole('admin'), validationMiddleware(ServiceDto), createService)
servicesRouter.put('/:id/update', authenticateToken, authorizeRole('admin'), validationMiddleware(ServiceDto), updateService)
servicesRouter.delete('/:id/delete', authenticateToken, authorizeRole('admin'),deleteService)

export default servicesRouter