 

import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { JWT_SECRET } from '../config/variables'
import User, { IUser } from '../models/user'
import { responseReturn } from '../utils/response'

interface CustomRequest extends Request {
  user: IUser
}

export const authenticate = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization

  if (!bearer) responseReturn(res, 401, { error: 'Unauthorized' })

  const [, token] = bearer!.split(' ')

  if (!token) responseReturn(res, 401, { error: 'Unauthorized' })

  try {
    const result = verify(token, JWT_SECRET)

    if (typeof result === 'object' && result.id) {
      const user = await User.findById(result.id).select('-password')

      if (!user) responseReturn(res, 401, { error: 'Unauthorized' })

      req.user = user!

      next()
    }
  } catch (error) {
    console.error(`Error in authenticate: ${error}`)

    responseReturn(res, 500, { error: 'An unexpected error occurred' })
  }
}
