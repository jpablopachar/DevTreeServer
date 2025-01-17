import { JwtPayload, sign } from 'jsonwebtoken'
import { JWT_SECRET } from '../config/variables'

export const generateJwt = (payload: JwtPayload): string => {
  return sign(payload, JWT_SECRET, { expiresIn: '180d' })
}
