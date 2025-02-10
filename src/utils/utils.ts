import { Request, Response } from 'express'
import { rateLimit } from 'express-rate-limit'
import { slowDown } from 'express-slow-down'

export function sendResponse(
  request: Request,
  response: Response,
  message: any,
  status = 200
) {
  const cache = new Set()
  const jsonString = JSON.stringify(message, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.has(value)) {
        return
      }
      cache.add(value)
    }
    return value
  })
  cache.clear()
  response.status(status).send(JSON.parse(jsonString))
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