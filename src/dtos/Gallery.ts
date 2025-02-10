import { array, object, string, z } from "zod";

export const GalleryDto = object({
  imageUrl: string({ required_error: 'Image url is required'}),
  services: array(string().uuid())
})

export type GalleryDtoType = z.infer<typeof GalleryDto>