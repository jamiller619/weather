import ky from 'ky'

export class FetchTimeoutError extends Error {}
export class FetchError extends Error {}

export default async function get<T = unknown>(
  url: string
): Promise<T | undefined> {
  const controller = new AbortController()
  const { signal } = controller

  setTimeout(() => {
    controller.abort()
  }, 10000)

  try {
    const json = await ky.get(url, { signal }).json()

    return json as T
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new FetchTimeoutError(err)
    }

    throw new FetchError(err)
  }
}
