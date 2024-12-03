import cors from 'cors'
import express from 'express'
import { corsConfig } from './config/cors'
import { connectDB } from './config/db'
import userRouter from './routes/user.routes'

connectDB()

const app = express()

app.use(cors(corsConfig))

app.use(express.json())

app.use('/', userRouter)

export default app
