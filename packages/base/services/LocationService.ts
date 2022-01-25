type Coords = {
  lat: number
  lng: number
}

export const calcDistInMiles = (p1: Coords, p2: Coords): number => {
  if (p1.lat === p2.lat && p1.lng === p2.lng) {
    return 0
  }

  const lat1rad = (Math.PI * p1.lat) / 180
  const lat2rad = (Math.PI * p2.lat) / 180
  const theta = p1.lng - p2.lng
  const thetarad = (Math.PI * theta) / 180
  const distance =
    Math.sin(lat1rad) * Math.sin(lat2rad) +
    Math.cos(lat1rad) * Math.cos(lat2rad) * Math.cos(thetarad)

  let dist = distance > 1 ? 1 : distance

  dist = Math.acos(dist)
  dist = (dist * 180) / Math.PI
  dist = dist * 60 * 1.1515

  return dist
}
