import * as NWS from 'lib/nws'
import { cache } from 'services/CacheService'
import get from 'utils/get'
import cacheKey from './cacheKey'

export type GridInfo = {
  gridId: string
  gridX: number
  gridY: number
  city?: string
  region?: string
  currentWeather: string
  forecastDaily: string
  forecastHourly: string
}

const API_URL = `https://api.weather.gov`

const normalizeCoord = (v: number) => v.toFixed(4)

const fetchGridInfo = async (lat: number, lng: number) => {
  const nlat = normalizeCoord(lat)
  const nlng = normalizeCoord(lng)
  const url = `${API_URL}/points/${nlat},${nlng}`

  const response = await get<NWS.PointsResponse>(url)

  if (response != null && response.properties != null) {
    const {
      relativeLocation,
      gridId,
      gridX,
      gridY,
      forecastHourly,
      forecast,
      forecastGridData,
    } = response.properties

    if (
      gridId == null ||
      gridX == null ||
      gridY == null ||
      forecast == null ||
      forecastGridData == null ||
      forecastHourly == null
    ) {
      throw new Error('Invalid grid response from NWS')
    }

    const data: GridInfo = {
      gridId,
      gridX,
      gridY,
      forecastDaily: forecast,
      forecastHourly,
      currentWeather: forecastGridData,
    }

    if (relativeLocation != null && relativeLocation.properties != null) {
      const { city, state: region } = relativeLocation.properties

      return {
        ...data,
        city,
        region,
      }
    }

    return data
  }
}

export const getGridInfo = cache(
  { ttl: 0, key: cacheKey('grid') },
  fetchGridInfo
)
