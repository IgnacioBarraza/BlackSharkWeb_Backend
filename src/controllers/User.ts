import { NextFunction, Request, Response } from 'express'
import { UserService } from '../services/User'
import { CustomError } from '../middleware/errorHandler'
import { UserPreferencesService } from '../services/UserPreferences'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { config } from 'dotenv'
import { sendResponse } from '../utils/utils'
import { UserDto } from '../dtos/User'
import { ZodError } from 'zod'
import sendMessage from '../utils/emailConfig'
import { User } from '../entities/User'

config()
const { JWT_SECRET } = process.env

export class UserController {
  private userService: UserService
  private userPreferencesService: UserPreferencesService
  private jwt_secret = JWT_SECRET

  constructor() {
    this.userService = new UserService()
    this.userPreferencesService = new UserPreferencesService()
  }

  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userService.getUsers()
      sendResponse(req, res, { users }, 200)
    } catch (error) {
      next(new CustomError('Error fetching users', 500, [error]))
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const uid = req.params.id
      const user = await this.userService.getUserById(uid)
      if (!user) return next(new CustomError('User not found', 404))
      
  
      sendResponse(req, res, { user }, 200)
    } catch (error) {
      next(new CustomError('Error fetching user', 500, [error]))
    }
  }
  
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
  
      const user = await this.userService.getUserByEmail(email)
      if (!user) return next(new CustomError('User not found', 401))
  
      const isPasswordValid = await bcrypt.compare(password, user.password)
      if (!isPasswordValid) return next(new CustomError('Invalid password', 401))
      
  
      const token = jwt.sign(
        { uid: user.uid },
        JWT_SECRET as string,
        { expiresIn: '3h' }
      )
  
      const userData = {
        uid: user.uid,
        userName: user.userName,
        name: user.name,
        email: user.email,
        phone: user.phone,
        userRole: user.userRole,
        emailVerified: user.emailVerified,
        userPreferences: user.userPreferences
      }
  
      sendResponse(req, res, { token, user: userData }, 200)
    } catch (error) {
      next(new CustomError('Error logging in', 500, [error]))
    }
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = UserDto.parse(req.body)
      const { userName, name, email, password, phone } = parsedData
  
      const hashedPassword = await bcrypt.hash(password, 10)
  
      const userPreferences = await this.userPreferencesService.createDefaultUserPreferences()
  
      const newUser = await this.userService.createUser({
        userName: userName,
        name: name,
        email: email,
        password: hashedPassword,
        userRole: 'user',
        phone: phone,
        emailVerified: false,
        userPreferences: userPreferences
      })
  
      const returnUserData = {
        uid: newUser.uid,
        userName: newUser.userName,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        emailVerified: newUser.emailVerified,
        userRole: newUser.userRole,
        userPreferences: newUser.userPreferences
      }
      
      await this.sendVerificationEmail(newUser)
  
      sendResponse(req, res, { user: returnUserData }, 201)
  
    } catch (error) {
      if (error instanceof ZodError) return next(new CustomError('Invalid data', 400, [error]))
      next(new CustomError('Error registering user', 500, [error]))
    }
  }

  async sendVerificationEmail(user: User) {
    const emailToken = jwt.sign(
      { uid: user.uid },
      JWT_SECRET as string,
      { expiresIn: '30m' }
    )
  
    const token = `${emailToken}`
    await sendMessage(user.email, token, 'Verificar correo electrónico Black Shark Web Studios')
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const uid = req.params.id
      const user = UserDto.partial().parse(req.body)
      const updatedUser = await this.userService.updateUser(uid, user)
      if (!updatedUser) {
        return next(new CustomError('User not found', 404));
      }
  
      sendResponse(req, res, { user: updatedUser }, 200)
    } catch (error) {
      next(new CustomError('Error updating user', 500, [error]));
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const uid = req.params.id
      const result = await this.userService.deleteUser(uid)
      if (!result) {
        return next(new CustomError('User not found', 404))
      }
  
      sendResponse(req, res, 'User deleted successfully', 200)
    } catch (error) {
      next(new CustomError('Error deleting user', 500, [error]))
    }
  }

  async recoverPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body
      const user = await this.userService.getUserByEmail(email)
      if (!user) return next(new CustomError('User not found', 404))
  
      const resetToken = jwt.sign(
        { uid: user.uid },
        JWT_SECRET as string,
        { expiresIn: '1h' }
      )
  
      const emailContent = `${resetToken}`
      const sendEmail = await sendMessage(email, emailContent, 'Restablecer contraseña Black Shark Web Studios')
  
      const { status, message } = sendEmail
      
      sendResponse(req, res, message, status)
    } catch (error) {
      next(new CustomError('Error recovering password', 500, [error]))
    }
  }
  
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { resetToken, newPassword } = req.body

      const decodedToken = jwt.verify(resetToken, this.jwt_secret as string) as { uid: string }

      const user = await this.userService.getUserById(decodedToken.uid)
      if (!user) return next(new CustomError('User not found', 404))

      const hashedPassword = await bcrypt.hash(newPassword, 10)

      const updatedUser = await this.userService.updateUser(decodedToken.uid, { password: hashedPassword })
      if (!updatedUser) return next(new CustomError('Error al actualizar la contraseña', 500))

      sendResponse(req, res, 'Password updated successfully', 200)
    } catch (error) {
      next(new CustomError('Error resetting password', 500, [error]))
    }
  }
  
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body
      const decodedToken = jwt.verify(token, this.jwt_secret as string) as {
        uid: string
      }

      const user = await this.userService.getUserById(decodedToken.uid)
      if (!user) return next(new CustomError('User not found', 404))

      const updatedUser = await this.userService.updateUser(decodedToken.uid, {
        emailVerified: true,
      })

      sendResponse(req, res, { updatedUser }, 200)
    } catch (error) {
      next(new CustomError('Error verifying email', 500, [error]))
    }
  }
}