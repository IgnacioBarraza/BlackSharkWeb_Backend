import { Router } from 'express'
import { ColaborationController } from '../controllers/ColaborationsController'
import { authenticateToken, authorizeRole } from '../middleware/validateUser'

const colabRouter = Router()
const colabController = new ColaborationController()


// Public routes
colabRouter.get('/', (req, res, next) =>  colabController.getColaborations(req, res, next))
colabRouter.get('/:uid', (req, res, next) =>  colabController.getColaborationById(req, res, next))

// Protected routes
colabRouter.use(authenticateToken)
colabRouter.use(authorizeRole(['admin']))
colabRouter.post('/', (req, res, next) =>  colabController.createColaboration(req, res, next))
colabRouter.put('/:uid', (req, res, next) =>  colabController.updateColaboration(req, res, next))
colabRouter.delete('/:uid', (req, res, next) =>  colabController.deleteColaboration(req, res, next))

export default colabRouter