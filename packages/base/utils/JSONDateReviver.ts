export default function JSONDateReviver(_: unknown, value: unknown) {
  if (typeof value === 'string') {
    const a = Date.parse(value)

    if (a) {
      return new Date(a)
    }
  }

  return value
}

export const parseObject = <T>(data: T) => {
  return JSON.parse(JSON.stringify(data), JSONDateReviver) as T
}
