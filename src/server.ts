import cors from 'cors'
import express from 'express'
import { connectDB, corsConfig } from './config'

connectDB()

const app = express()

app.use(cors(corsConfig))

app.use(express.json())

export default app
