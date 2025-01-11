import { object, string, number, boolean, z, array } from 'zod'

export const ServiceDto = object({
  uid: string(),
  name: string({ required_error: 'Service name is required'}).min(1, 'Name must be at least 1 character long').max(250, 'Name must be at most 250 characters long'),
  description: string({ required_error: 'Service name is required'}).min(1, 'Name must be at least 1 character long').max(250, 'Name must be at most 250 characters long'),
  price: number().positive('Price must be a positive number').int('Price must be an integer').min(1, 'Price must be at least 1'),
  imageUrl: string({ required_error: 'Service name is required'}).min(1, 'Name must be at least 1 character long').max(250, 'Name must be at most 250 characters long'),
  recommended: boolean({ required_error: 'recommended is required'}),
  tools: array(string().uuid()),
})

export type ServiceDtoType = z.infer<typeof ServiceDto>