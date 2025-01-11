import { Request, Response, NextFunction } from 'express'

declare module 'express-serve-static-core' {
  interface Request {
    user?: TokenPayload;
  }
}
import jwt from 'jsonwebtoken'
import { CustomError } from './errorHandler'

interface TokenPayload {
  id: string
  role: string
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return next(new CustomError('Unauthorized', 401))
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      return next(new CustomError('Unauthorized', 401))
    }
    req.user = user as TokenPayload
    next()
  })
}

export function authorizeRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return next(new CustomError('Forbidden', 403))
    }
    next()
  }
}