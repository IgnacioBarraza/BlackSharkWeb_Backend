import express, { Request, Response } from 'express'
import { json, urlencoded } from 'body-parser'
import { AppDataSource } from './config/data-source'
import { config } from "dotenv"
import cors from 'cors'
import morgan from 'morgan'

/** IMPORTS **/

// Routes:
import servicesRouter from './routes/ServicesRouter'
import userRouter from './routes/UserRouter'
import toolsRouter from './routes/ToolsRouter'
import userPreferenceRouter from './routes/userPreferencesRouter'
import galleryRouter from './routes/GalleryRouter'
import colabRouter from './routes/ColaborationRouter'

// Middleware:
import { errorHandler } from './middleware/errorHandler'

// Utils:
import { sendResponse } from './utils/utils'


/** APP **/
config()
const app = express()

/** MIDDLEWARES **/
app.use(json())
app.use(cors())
app.use(urlencoded({ extended: true }))
app.use(morgan('dev'))

/** ROUTES **/
app.use('/api/users', userRouter)
app.use('/api/services', servicesRouter)
app.use('/api/tools', toolsRouter)
app.use('/api/userPreferences', userPreferenceRouter)
app.use('/api/gallery', galleryRouter)
app.use('/api/colaborations', colabRouter)

app.use('/healthy', (req: Request, res: Response) => {
  return sendResponse(req, res, 'OK', 200)
})


/** ERROR HANDLING **/
app.use(errorHandler);

/** SERVER **/
const PORT = process.env.PORT || 4000;

AppDataSource.initialize().then(() => {
  console.log('Database initialized and connected')
  app.listen(PORT, () => {
    console.log(`🚀🚀 Server running on port: ${PORT} 🚀🚀`);
  });
}).catch((err) => {
  console.log('Error connecting to database: ', err)
})