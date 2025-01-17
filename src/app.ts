import express, { Request, Response } from 'express'
import cors from 'cors'
import { json, urlencoded } from 'body-parser'
import { AppDataSource } from './config/data-source'
import { config } from "dotenv"
import morgan from 'morgan'

/** IMPORTS **/

// Routes:
import servicesRouter from './routes/Services'
import userRouter from './routes/User'

// Middleware:
import { errorHandler } from './middleware/errorHandler'

// Utils:
import { sendResponse } from './utils/utils'
import toolsRouter from './routes/Tools'
import userPreferenceRouter from './routes/userPreferences'


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

export default app