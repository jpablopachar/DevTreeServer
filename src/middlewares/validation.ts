import { NextFunction, Request, Response } from 'express'
import { Result, ValidationError, validationResult } from 'express-validator'

export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors: Result<ValidationError> = validationResult(req)

  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() })

    return
  }

  next()
}
