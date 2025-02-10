import { Router } from 'express'
import { UserPreferencesController } from '../controllers/UserPreferencesController'
import { authenticateToken, authorizeRole } from '../middleware/validateUser'

const userPreferenceRouter = Router()
const userPreferencesController = new UserPreferencesController()

userPreferenceRouter.use(authenticateToken)
userPreferenceRouter.use(authorizeRole(['user', 'admin']))

userPreferenceRouter.get('/:uid', (req, res, next) => userPreferencesController.getUserPreferences(req, res, next))
userPreferenceRouter.put('/:uid', (req, res, next) => userPreferencesController.updateUserPreferences(req, res, next))
userPreferenceRouter.delete('/:uid', (req, res, next) => userPreferencesController.deleteUserPreferences(req, res, next))

export default userPreferenceRouter