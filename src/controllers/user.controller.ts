import { Request, Response } from 'express'
import slug from 'slug'
import User from '../models/user'
import { hashPassword } from '../utils'

export const createAccount = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    const error = new Error('User already exists')

    return res.status(400).json({ error: error.message })
  }

  const handle: string = slug(req.body.handle, '')

  const handleExists = await User.findOne({ handle })

  if (handleExists) {
    const error = new Error('Handle already exists')

    return res.status(409).json({ error: error.message })
  }

  const user = new User(req.body)

  user.password = await hashPassword(password)
  user.handle = handle

  await user.save()

  return res.status(201).send('User created')
}
