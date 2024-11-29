import cors from 'cors'
import express from 'express'
import { connectDB, corsConfig } from './config'
import userRouter from './routes/user.routes'

connectDB()

const app = express()

app.use(cors(corsConfig))

app.use(express.json())

app.use('/', userRouter)

export default app
