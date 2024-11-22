import dotenv from 'dotenv'

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'dev'}` })

export const NODE_ENV: string = process.env.NODE_ENV || 'dev';
export const PORT: string | number = process.env.PORT || 3000;
export const MONGO_URI: string = process.env.MONGO_URI || '';
export const CLIENT_URL: string = process.env.CLIENT_URL || '';
export const JWT_SECRET: string = process.env.JWT_SECRET || '';
export const CLOUDINARY_NAME: string = process.env.CLOUDINARY_NAME || '';
export const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || '';
export const CLOUDINARY_API_SECRET: string = process.env.CLOUDINARY_API_SECRET || '';