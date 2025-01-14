import { Router } from 'express'
import { ServiceController } from '../controllers/Services'
import { validationMiddleware } from '../middleware/validationMiddleware'
import { ServiceDto } from '../dtos/Services'
import { authenticateToken, authorizeRole } from '../middleware/validateUser'

const servicesRouter = Router()
const serviceController = new ServiceController()

// Public routes
servicesRouter.get('/', (req, res, next) => serviceController.getServices(req, res, next))
servicesRouter.get('/:id', (req, res, next) => serviceController.getServiceById(req, res, next))

// Protected routes
servicesRouter.use(authenticateToken)
servicesRouter.post('/', authorizeRole('admin'), validationMiddleware(ServiceDto), (req, res, next) => serviceController.createService(req, res, next))
servicesRouter.put('/:id', authorizeRole('admin'), (req, res, next) => serviceController.updateService(req, res, next))
servicesRouter.delete('/:id', authorizeRole('admin'), (req, res, next) => serviceController.deleteService(req, res, next))

export default servicesRouter