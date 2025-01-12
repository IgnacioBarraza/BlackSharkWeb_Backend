import { Router } from 'express'
import { getTools, getToolById, createTool, updateTool, deleteTool } from '../controllers/Tools'
import { authenticateToken, authorizeRole } from '../middleware/validateUser'

const toolsRouter = Router()

// Public routes
toolsRouter.get('/', getTools)
toolsRouter.get('/:id', getToolById)

// Protected routes
toolsRouter.use(authenticateToken)
toolsRouter.post('/', authorizeRole('admin'), createTool)
toolsRouter.put('/:id/update', authorizeRole('admin'), updateTool)
toolsRouter.delete('/:id/delete', authorizeRole('admin'), deleteTool)

export default toolsRouter