import { blue } from 'colors'
import { PORT } from './config/variables'
import server from './server'

const port: string | number = PORT

server.listen(port, () => {
  console.log(blue.bold(`Server running on: http://localhost:${port}`))
})
