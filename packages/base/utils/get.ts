import got from 'got'

export default async function get<T>(url: string) {
  return (await got(url, { retry: { limit: 3 } }).json()) as T | undefined
}
