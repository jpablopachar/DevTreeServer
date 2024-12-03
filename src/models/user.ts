import { Document, model, Schema } from 'mongoose'

export interface IUser extends Document {
  email: string
  password: string
  name: string
  description: string
  image: string
  links: string
  handle: string
}

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  image: {
    type: String,
    default: '',
  },
  links: {
    type: String,
    default: '[]',
  },
  handle: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
})

const User = model<IUser>('User', userSchema)

export default User
