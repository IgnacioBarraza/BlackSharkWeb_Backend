import { array, object, string } from 'zod'

export const ColaborationsDto = object({
  title: string({ required_error: 'Colaboration title is required'}),
  description: string({ required_error: 'Colaboration description is required'}),
  imageUrl: string({ required_error: 'Colaboration image url is required'}),
  services: array(string().uuid())
})
