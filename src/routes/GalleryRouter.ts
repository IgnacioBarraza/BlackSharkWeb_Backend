import { Router } from 'express'
import { GalleryController } from '../controllers/GalleryController'

const galleryRouter = Router()
const galleryController = new GalleryController()

// Public routes
galleryRouter.get('/', (req, res, next) => galleryController.getGallery(req, res, next))
galleryRouter.get('/:uid', (req, res, next) => galleryController.getGalleryById(req, res, next))

// Protected routes
galleryRouter.post('/', (req, res, next) => galleryController.createGallery(req, res, next))
galleryRouter.put('/:uid', (req, res, next) => galleryController.updateGallery(req, res, next))
galleryRouter.delete('/:uid', (req, res, next) => galleryController.deleteGallery(req, res, next))
galleryRouter.post('/:uid/services', (req, res, next) => galleryController.addServicesToGallery(req, res, next))

export default galleryRouter