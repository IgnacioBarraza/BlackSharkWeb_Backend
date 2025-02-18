import { AppDataSource } from '../config/data-source'
import { Gallery } from '../dtos/Gallery'

export class GalleryService {
  private galleryRepository = AppDataSource.getRepository(Gallery)
  
  async getGallery(): Promise<Gallery[] | null> {
    return this.galleryRepository.find({
      relations: {
        services: true
      }
    })
  }

  async getGalleryById(uid: string): Promise<Gallery | null> {
    return this.galleryRepository.findOne({
      where: { uid: uid},
      relations: {
        services: true
      }
    })
  }

  async createGallery(gallery: Partial<Gallery>): Promise<Gallery> {
    return this.galleryRepository.save(gallery)
  }

  async updateGallery(uid: string, galleryUpdates: Partial<Gallery>): Promise<Gallery | null> {
    const galleryToUpdate = await this.galleryRepository.findOne({ where: { uid: uid } })
    if (!galleryToUpdate) return null

    return this.galleryRepository.save({ ...galleryToUpdate, ...galleryUpdates})
  }

  async deleteGallery(uid: string): Promise<void> {
    await this.galleryRepository.delete(uid)
  }
}