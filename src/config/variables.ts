import dotenv from 'dotenv'

dotenv.config({ path: `.env.${process.env.NODE_ENV || 'dev'}` })

export const NODE_ENV: string = process.env.NODE_ENV || 'dev';
export const PORT: string | number = process.env.PORT || 3000;
export const MONGO_URI: string = process.env.MONGO_URI || '';
export const CLIENT_URL: string = process.env.CLIENT_URL || '';