export default function cacheKey(prefix: string) {
  return (lat: string, lng: string) => {
    const nlat = Math.round(Number(lat))
    const nlng = Math.round(Number(lng))

    return `${prefix}/${nlat},${nlng}`
  }
}
