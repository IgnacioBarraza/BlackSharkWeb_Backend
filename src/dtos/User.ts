import { object, string, boolean } from 'zod'

export const UserDto = object({
  userName: string({ required_error: 'Username is required'}).min(1, 'Username must be at least 1 character long').max(250, 'Username must be at most 250 characters long'),
  name: string({ required_error: 'Name is required'}).min(1, 'Name must be at least 1 character long').max(250, 'Name must be at most 250 characters long'),
  email: string({ required_error: 'Email is required'}).email('Email must be a valid email'),
  password: string({ required_error: 'Password is required'}).min(8, 'Password must be at least 8 characters long'),
  phone: string({ required_error: 'Phone is required'}).min(8, 'Phone must be at least 10 characters long').max(15, 'Phone must be at most 15 characters long'),
})