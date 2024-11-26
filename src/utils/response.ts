/* eslint-disable @typescript-eslint/no-explicit-any */
import { Response } from "express"

export const responseReturn = (res: Response, code: number, data: any) => res.status(code).json(data)
