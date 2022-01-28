import cp from 'child_process'
import { createClient } from 'redis'

const client = createClient({
  url: process.env.DB_URL,
})

const startRedisServer = () => {
  try {
    cp.exec('redis-server')
    console.log('Started redis server!')

    return true
  } catch {
    console.log(`Unable to start redis server :(`)

    return false
  }
}

export default async function connect() {
  try {
    await client.connect()

    return client
  } catch (err) {
    const errMessage = (err as Error)?.message

    if (errMessage === 'Socket already opened') {
      return client
    }

    if (startRedisServer() === false) {
      const msg = `Error connecting to redis: ${errMessage}`

      console.error(err)

      throw new Error(msg)
    }
  }
}
