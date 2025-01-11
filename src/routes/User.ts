import { Router } from 'express'
import { getUsers, getUserById, login, register, updateUser, deleteUser, recoverPassword, resetPassword, verifyEmail } from '../controllers/User'
import { authenticateToken, authorizeRole } from '../middleware/validateUser'

const userRouter = Router()

// Public routes
userRouter.post('/login', login)
userRouter.post('/register', register)
userRouter.post('/recover-password', recoverPassword)
userRouter.post('/reset-password', resetPassword)
userRouter.get('/verify-email', verifyEmail)

// Protected routes
userRouter.use(authenticateToken)
userRouter.get('/', authorizeRole('admin'), getUsers)
userRouter.get('/:id', authorizeRole('admin'), getUserById)
userRouter.put('/:id/update', updateUser)
userRouter.delete('/:id/delete', authorizeRole('admin'), deleteUser)

export default userRouter