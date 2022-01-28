import { parseObject } from '@weather/base/utils/JSONDateReviver'

type CacheEntry<T> = {
  maxAge?: number
  data: T
}

type CacheRoot<T> = {
  [key: string]: CacheEntry<T>
}

export default class Cache<T> {
  key: string
  storage: Storage

  constructor(key: string, storage = window.localStorage) {
    this.key = key
    this.storage = storage
  }

  #getRoot() {
    const cached = this.storage.getItem(this.key)

    if (cached != null) {
      return JSON.parse(cached) as CacheRoot<T>
    }
  }

  get(id: string) {
    const entry = this.#getRoot()?.[id]

    if (entry?.maxAge != null) {
      if (entry.maxAge > 0) {
        if (Date.now() > entry.maxAge) {
          return this.remove(id)
        }
      }
    }

    if (entry?.data != null) {
      return parseObject(entry.data)
    }

    return undefined
  }

  set(id: string, value: T, maxAge = 0) {
    const entry: CacheEntry<T> = {
      maxAge,
      data: value,
    }

    const data = {
      ...this.#getRoot(),
      [id]: entry,
    }

    this.storage.setItem(this.key, JSON.stringify(data))
  }

  remove(id: string) {
    const data = this.#getRoot()

    if (data != null) {
      delete data[id]

      this.storage.setItem(this.key, JSON.stringify(data))
    }

    return undefined
  }
}
