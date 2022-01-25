import connect from '@weather/base/db/connect'
import { PORT } from 'config'
import cors from 'cors'
import express from 'express'
import weather from './weather'

const server = express()

server.use(
  cors({
    origin: process.env.ACCEPT_FROM,
  })
)

connect().then(() => {
  server.get('/healthcheck', (_, res) => res.send('OK'))
  server.use('/weather', weather)

  server.listen(PORT, () => {
    console.log(`server running on PORT ${PORT}`)
  })
})
