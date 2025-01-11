import { Request, Response } from 'express'
import { rateLimit } from 'express-rate-limit'
import { slowDown } from 'express-slow-down'

export function sendResponse(
  request: Request,
  response: Response,
  message: any,
  status = 200
) {
  return response.status(status).send(message)
}

export const encrypt = () => {
  const array = new Uint8Array(5)
  crypto.getRandomValues(array)

  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: true,
    legacyHeaders: false
})

export const slowDownLimiter = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 50,
    delayMs: hits => hits * 100
})