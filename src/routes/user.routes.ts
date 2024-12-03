/* eslint-disable @typescript-eslint/no-explicit-any */

import { RequestHandler, Router } from 'express'
import { body } from 'express-validator'
import {
  createAccount,
  getUser,
  getUserByHandle,
  login,
  searchByHandle,
  updateProfile,
  uploadImage,
} from '../controllers/user.controller'
import { authenticate } from '../middlewares/auth'
import { handleInputErrors } from '../middlewares/validation'

const userRouter = Router()

const authMiddleware = authenticate as RequestHandler

userRouter.post(
  '/auth/register',
  body('handle').notEmpty().withMessage('Handle is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Email is invalid'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password is greater than 6 characters'),
  handleInputErrors,
  createAccount
)

userRouter.post(
  '/auth/login',
  body('email').isEmail().withMessage('Email is invalid'),
  body('password').notEmpty().withMessage('Password is required'),
  handleInputErrors,
  login
)

userRouter.get('/user', authMiddleware, getUser as any as RequestHandler)

userRouter.patch(
  '/user',
  body('handle').notEmpty().withMessage('Handle is required'),
  handleInputErrors,
  authMiddleware,
  updateProfile as any as RequestHandler
)

userRouter.post(
  '/user/image',
  authMiddleware,
  uploadImage as any as RequestHandler
)

userRouter.get('/:handle', getUserByHandle)

userRouter.post(
  '/search',
  body('handle').notEmpty().withMessage('Handle is required'),
  handleInputErrors,
  searchByHandle
)

export default userRouter
