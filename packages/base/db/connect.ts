import { createClient } from 'redis'

const client = createClient({
  url: process.env.DB_URL,
})

export default async function connect() {
  try {
    await client.connect()

    return client
  } catch (err) {
    const errMessage = (err as Error)?.message

    if (errMessage === 'Socket already opened') {
      return client
    }

    const msg = `Error connecting to redis: ${errMessage}`

    console.error(err)

    throw new Error(msg)
  }
}
