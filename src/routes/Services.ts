import { Router } from 'express'
import { ServiceController } from '../controllers/Services'
import { validationMiddleware } from '../middleware/validationMiddleware'
import { ServiceDto } from '../dtos/Services'
import { authenticateToken, authorizeRole } from '../middleware/validateUser'

const servicesRouter = Router()
const serviceController = new ServiceController()

// Public routes
servicesRouter.get('/', (req, res, next) => serviceController.getServices(req, res, next))
servicesRouter.get('/:uid', (req, res, next) => serviceController.getServiceById(req, res, next))

// Protected routes
servicesRouter.use(authenticateToken)
servicesRouter.use(authorizeRole('admin'))
servicesRouter.post('/', validationMiddleware(ServiceDto), (req, res, next) => serviceController.createService(req, res, next))
servicesRouter.put('/:uid', (req, res, next) => serviceController.updateService(req, res, next))
servicesRouter.put('/:uid/add-tools', (req, res, next) => serviceController.addToolsToService(req, res, next))
servicesRouter.delete('/:uid', (req, res, next) => serviceController.deleteService(req, res, next))
servicesRouter.delete('/:uid/remove-tool/:toolId', (req, res, next) => serviceController.removeToolFromService(req, res, next));

export default servicesRouter