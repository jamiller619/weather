/* eslint-disable @typescript-eslint/no-explicit-any */
import connect from 'db/connect'

const client = await connect()

type CacheOptions = {
  ttl: number
  key?: string | ((...args: any[]) => string)
}

type ReturnPromiseType<T extends (...args: any) => Promise<any>> = T extends (
  ...args: any
) => Promise<infer R>
  ? R
  : any

export const cache = <F extends (...args: any[]) => any>(
  { ttl = 0, key = '' }: CacheOptions,
  callback: F
) => {
  return async (...args: Parameters<F>): Promise<ReturnPromiseType<F>> => {
    const pkey =
      typeof key === 'function'
        ? key(...args)
        : `${key}_${JSON.stringify(args)}`
    const cached = await client?.get(pkey)

    if (cached) {
      return JSON.parse(cached)
    }

    const data = await callback(...args)

    if (ttl > 0) {
      await client?.setEx(pkey, ttl, JSON.stringify(data))
    } else {
      await client?.set(pkey, JSON.stringify(data))
    }

    return data
  }
}
