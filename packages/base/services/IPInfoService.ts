import Location, { createLocation } from '@weather/base/models/Location'

type IPInfoResponse = {
  ip: string
  hostname: string
  city: string
  region: string
  country: string
  loc: string
  org: string
  postal: string
  timezone: string
}

const formatIPInfoResponse = (
  response: IPInfoResponse
): Pick<Location, 'lat' | 'lng' | 'city' | 'region'> => {
  const [lat, lng] = response.loc.split(',').map(Number)
  const { city, region } = response

  return {
    lat,
    lng,
    city,
    region,
  }
}

/**
 * @param ipinfoToken ipinfo token: only needed client side.
 * @param ipaddress IP address to lookup. If one isn't provided,
 * the caller's IP will be used.
 * @returns Location
 */
export const getLocationFromIP = async (
  ipinfoToken?: string,
  ipaddress?: string
): Promise<Location> => {
  const token = ipinfoToken ?? process.env.IPINFO_TOKEN

  if (token == null) {
    throw new Error(`ipinfo token not provided!`)
  }

  const param = ipaddress ?? 'json'
  const url = `https://ipinfo.io/${param}?token=${IPINFO_TOKEN}`

  try {
    const request = await fetch(url)
    const result = (await request.json()) as IPInfoResponse

    return createLocation('ip', formatIPInfoResponse(result))
  } catch (err) {
    throw new Error(`ipinfo error: ${(err as Error)?.message}`)
  }
}
