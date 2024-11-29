import { Router } from 'express'
import { body } from 'express-validator'
import { createAccount } from '../controllers'
import { handleInputErrors } from '../middlewares'

const userRouter = Router()

userRouter.post(
  '/auth/register',
  body('handle').notEmpty().withMessage('Handle is required'),
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Email is invalid'),
  body('email').notEmpty().withMessage('Email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password is greater than 6 characters'),
  handleInputErrors,
  createAccount
)

export default userRouter
