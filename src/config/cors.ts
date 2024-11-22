import { CorsOptions } from 'cors'
import { CLIENT_URL } from './variables'

export const corsConfig: CorsOptions = {
  origin: function (origin: string | undefined, callback) {
    const whiteList: (string | undefined)[] = [CLIENT_URL]

    if (process.argv[2] === '--api') whiteList.push(undefined)

    if (whiteList.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Error de CORS'))
    }
  },
}
