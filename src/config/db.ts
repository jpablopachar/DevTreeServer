import { bgRed, cyan } from 'colors'
import { connect } from 'mongoose'
import { MONGO_URI } from './variables'

export const connectDB = async (): Promise<void> => {
  try {
    const { connection } = await connect(MONGO_URI)

    const url = `${connection.host}:${connection.port}`

    console.log(cyan.bold(`Database Connected: ${url}`))
  } catch (error) {
    console.log(bgRed.white.bold('MongoDB Connection Error:'), error)

    process.exit(1)
  }
}
