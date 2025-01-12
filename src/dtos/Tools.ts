import { array, object, string, z } from 'zod'

export const ToolsDto = object({
  name: string({ required_error: 'Tool name is required'}).min(1, 'Name must be at least 1 character long').max(250, 'Name must be at most 250 characters long'),
  description: string({ required_error: 'Tool description is required'}).min(1, 'Description must be at least 1 character long').max(250, 'Description must be at most 250 characters long'),
  type: string({ required_error: 'tool type is required'}),
  imageUrl: string({ required_error: 'Tool image is required'}).min(1, 'Image must be at least 1 character long').max(250, 'Image must be at most 250 characters long'),
  services: array(string().uuid())
})

export type ToolsDtoType = z.infer<typeof ToolsDto>