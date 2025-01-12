import { Router } from 'express'
import { ToolsController } from '../controllers/Tools'
import { authenticateToken, authorizeRole } from '../middleware/validateUser'

const toolsRouter = Router()

const { getTools, getToolById, createTool, updateTool, deleteTool } = new ToolsController()

// Public routes
toolsRouter.get('/', getTools)
toolsRouter.get('/:id', getToolById)

// Protected routes
toolsRouter.use(authenticateToken)
toolsRouter.post('/', authorizeRole('admin'), createTool)
toolsRouter.put('/:id/update', authorizeRole('admin'), updateTool)
toolsRouter.delete('/:id/delete', authorizeRole('admin'), deleteTool)

export default toolsRouter