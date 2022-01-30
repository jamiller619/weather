import { parseObject } from '@weather/base/utils/JSONDateReviver'

type CacheEntry<T> = {
  maxAge?: number
  data: T
}

type CacheRoot<T> = {
  [key: string]: CacheEntry<T>
}

type KeyValue<T> = {
  key: string
  value: T
}

export default class Cache<T> {
  key: string
  storage: Storage

  constructor(key: string, storage = window.localStorage) {
    this.key = key
    this.storage = storage
  }

  #getRoot(): CacheRoot<T> | undefined {
    const cached = this.storage.getItem(this.key)

    if (cached != null) {
      return JSON.parse(cached) as CacheRoot<T>
    }
  }

  getAll(): KeyValue<T>[] | undefined {
    const root = this.#getRoot()

    if (root != null) {
      return Object.keys(root).map((key) => {
        const value = this.get(key)

        if (value != null) {
          return {
            key,
            value,
          }
        }
      }).filter((kv) => kv != null) as KeyValue<T>[]
    }
  }

  get(id: string): T | undefined {
    const entry = this.#getRoot()?.[id]

    if (entry?.maxAge != null) {
      if (entry.maxAge > 0) {
        if (Date.now() > entry.maxAge) {
          this.remove(id)

          return undefined
        }
      }
    }

    if (entry?.data != null) {
      return parseObject(entry.data)
    }

    return undefined
  }

  set(id: string, value: T, maxAge = 0): void {
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

  remove(id: string): void {
    const data = this.#getRoot()

    if (data != null) {
      delete data[id]

      this.storage.setItem(this.key, JSON.stringify(data))
    }
  }
}
