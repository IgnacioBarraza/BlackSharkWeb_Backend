import { Router } from 'express'
import { UserController } from '../controllers/User'
import { authenticateToken, authorizeRole } from '../middleware/validateUser'

const userRouter = Router()
const userController = new UserController()

// Public routes
userRouter.post('/login', (req, res, next) => userController.login(req, res, next))
userRouter.post('/register', (req, res, next) => userController.register(req, res, next))
userRouter.post('/recover-password', (req, res, next) => userController.recoverPassword(req, res, next))
userRouter.post('/reset-password', (req, res, next) => userController.resetPassword(req, res, next))
userRouter.get('/verify-email', (req, res, next) => userController.verifyEmail(req, res, next))

// Protected routes
userRouter.use(authenticateToken)
userRouter.get('/', authorizeRole('admin'), (req, res, next) => userController.getUsers(req, res, next))
userRouter.get('/:id', authorizeRole('admin'), (req, res, next) => userController.getUserById(req, res, next))
userRouter.put('/:id/update', (req, res, next) => userController.updateUser(req, res, next))
userRouter.delete('/:id/delete', authorizeRole('admin'), (req, res, next) => userController.deleteUser(req, res, next))

export default userRouter