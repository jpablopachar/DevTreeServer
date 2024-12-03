import { UploadApiResponse } from 'cloudinary'
import { Request, Response } from 'express'
import { Result, ValidationError, validationResult } from 'express-validator'
import formidable from 'formidable'
import IncomingForm from 'formidable/Formidable'
import slug from 'slug'
import { v4 as uuid } from 'uuid'
import cloudinary from '../config/cloudinary'
import User, { IUser } from '../models/user'
import { checkPassword, hashPassword } from '../utils/auth'
import { generateJwt } from '../utils/jwt'
import { responseReturn } from '../utils/response'

interface CustomRequest extends Request {
  user: IUser
}

export const createAccount = async (req: Request, res: Response) => {
  try {
    const { email, password, handle: rawHandle } = req.body

    if (!email || !password || !rawHandle)
      responseReturn(res, 400, {
        error: 'Email, password and handle are required',
      })

    if (await User.exists({ email }))
      responseReturn(res, 400, { error: 'User already exists' })

    const handle: string = slug(rawHandle, '')

    if (await User.exists({ handle }))
      responseReturn(res, 409, { error: 'Handle already exists' })

    const hashedPassword: string = await hashPassword(password)

    const user = new User({
      ...req.body,
      password: hashedPassword,
      handle,
    })

    await user.save()

    responseReturn(res, 201, { message: 'User created' })
  } catch (error) {
    console.error(`Error in createAccount: ${error}`)

    responseReturn(res, 500, { error: 'An unexpected error occurred' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const errors: Result<ValidationError> = validationResult(req)

    if (!errors.isEmpty()) responseReturn(res, 400, { errors: errors.array() })

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) responseReturn(res, 404, { error: 'User not found' })

    const isPasswordValid: boolean = await checkPassword(
      password,
      user!.password
    )

    if (!isPasswordValid)
      responseReturn(res, 401, { error: 'Invalid password' })

    const token = generateJwt({ id: user!._id })

    responseReturn(res, 200, { token })
  } catch (error) {
    console.error(`Error in login: ${error}`)
  }
}

export const getUser = (req: CustomRequest, res: Response) => {
  return responseReturn(res, 200, req.user)
}

export const updateProfile = async (req: CustomRequest, res: Response) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) responseReturn(res, 400, { errors: errors.array() })

    const { description, links, handle: rawHandle } = req.body

    const handle: string = slug(rawHandle, '')
    const handleExists = await User.findOne({ handle })

    if (handleExists && handleExists.email !== req.user.email) {
      responseReturn(res, 409, { error: 'Handle already exists' })
    }

    if (req.user) {
      req.user.description = description
      req.user.links = links
      req.user.handle = handle

      await req.user.save()

      responseReturn(res, 200, { message: 'Profile updated' })
    } else {
      responseReturn(res, 404, { error: 'User not found' })
    }
  } catch (error) {
    console.error(`Error in updateProfile: ${error}`)

    responseReturn(res, 500, { error: 'An unexpected error occurred' })
  }
}

export const uploadImage = async (req: CustomRequest, res: Response) => {
  const form: IncomingForm = formidable({ multiples: false })

  try {
    const { files } = await new Promise<{
      fields: formidable.Fields
      files: formidable.Files
    }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        else resolve({ fields, files })
      })
    })

    if (!files.file || !files.file[0])
      return responseReturn(res, 400, { error: 'No file uploaded' })

    const result: UploadApiResponse = await cloudinary.uploader.upload(
      files.file[0].filepath,
      { public_id: uuid() }
    )

    req.user.image = result.secure_url

    await req.user.save()

    responseReturn(res, 200, { image: result.secure_url })
  } catch (error) {
    console.error(`Error in uploadImage: ${error}`)

    responseReturn(res, 500, { error: 'An unexpected error occurred' })
  }
}

export const getUserByHandle = async (req: Request, res: Response) => {
  try {
    const { handle } = req.params

    const user = await User.findOne({ handle }).select(
      '-_id -__v -email -password'
    )

    if (!user) responseReturn(res, 404, { error: 'User not found' })

    responseReturn(res, 200, user)
  } catch (error) {
    console.error(`Error in getUserByHandle: ${error}`)

    responseReturn(res, 500, { error: 'An unexpected error occurred' })
  }
}

export const searchByHandle = async (req: Request, res: Response) => {
  try {
    const { handle } = req.body

    if (!handle || typeof handle !== 'string')
      responseReturn(res, 400, {
        error: 'Handle is required and string',
      })

    const user = await User.findOne({ handle })

    if (user) responseReturn(res, 409, { error: `${handle} already exists` })

    responseReturn(res, 200, { message: `${handle} is available` })
  } catch (error) {
    console.error(`Error in searchByHandle: ${error}`)

    responseReturn(res, 500, { error: 'An unexpected error occurred' })
  }
}
