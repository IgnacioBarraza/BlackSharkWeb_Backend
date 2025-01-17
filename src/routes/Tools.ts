import { Router } from 'express'
import { ToolsController } from '../controllers/Tools'
import { authenticateToken, authorizeRole } from '../middleware/validateUser'

const toolsRouter = Router()
const toolsController = new ToolsController()

// Public routes
toolsRouter.get('/', (req, res, next) =>  toolsController.getTools(req, res, next))
toolsRouter.get('/:uid', (req, res, next) =>  toolsController.getToolById(req, res, next))

// Protected routes
toolsRouter.use(authenticateToken)
toolsRouter.use(authorizeRole(['admin']))
toolsRouter.post('/', (req, res, next) =>  toolsController.createTool(req, res, next))
toolsRouter.put('/:uid', (req, res, next) =>  toolsController.updateTool(req, res, next))
toolsRouter.delete('/:uid', (req, res, next) =>  toolsController.deleteTool(req, res, next))

export default toolsRouter