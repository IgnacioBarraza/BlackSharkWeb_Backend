import { Router } from 'express'
import { ToolsController } from '../controllers/Tools'
import { authenticateToken, authorizeRole } from '../middleware/validateUser'

const toolsRouter = Router()
const toolsController = new ToolsController()

// Public routes
toolsRouter.get('/', (req, res, next) =>  toolsController.getTools(req, res, next))
toolsRouter.get('/:id', (req, res, next) =>  toolsController.getToolById(req, res, next))

// Protected routes
toolsRouter.use(authenticateToken)
toolsRouter.post('/', authorizeRole('admin'), (req, res, next) =>  toolsController.createTool(req, res, next))
toolsRouter.put('/:id/update', authorizeRole('admin'), (req, res, next) =>  toolsController.updateTool(req, res, next))
toolsRouter.delete('/:id/delete', authorizeRole('admin'), (req, res, next) =>  toolsController.deleteTool(req, res, next))

export default toolsRouter