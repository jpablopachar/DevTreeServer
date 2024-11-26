import { Request, Response } from 'express'
import slug from 'slug'
import User from '../models/user'
import { hashPassword, responseReturn } from '../utils'

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { email, password, handle: rawHandle } = req.body

    if (await User.exists({ email }))
      return responseReturn(res, 400, { error: 'User already exists' })

    const handle: string = slug(rawHandle, '')

    if (await User.exists({ handle }))
      return responseReturn(res, 409, { error: 'Handle already exists' })

    const user = new User(req.body)

    user.password = await hashPassword(password)
    user.handle = handle

    await user.save()

    return responseReturn(res, 201, { message: 'User created' })
  } catch (error) {
    console.log(`Error in createAccount: ${error}`)

    return responseReturn(res, 500, { error: 'An unexpected error occurred' })
  }
}
