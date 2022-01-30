import { cache } from './CacheService'
import cacheKey from './weather/cacheKey'
import * as weather from './weather/currentWeather'
import * as forecast from './weather/forecast'
import Weather, { CurrentWeather, Forecast } from '~/models/Weather'

const ttls = {
  current: Number(process.env.TTL_CURRENT),
  hourly: Number(process.env.TTL_HOURLY),
  daily: Number(process.env.TTL_DAILY),
}

export const getCurrentWeather = cache(
  { ttl: ttls.current, key: cacheKey('current') },
  weather.getCurrentWeather
)
export const getDailyForecast = cache(
  { ttl: ttls.daily, key: cacheKey('daily') },
  forecast.getDailyForecast
)
export const getHourlyForecast = cache(
  { ttl: ttls.hourly, key: cacheKey('hourly') },
  forecast.getHourlyForecast
)

export const getWeather = async (
  lat: number,
  lng: number
): Promise<Weather> => {
  const current = await getCurrentWeather(lat, lng)
  const daily = await getDailyForecast(lat, lng)
  const hourly = await getHourlyForecast(lat, lng)

  return {
    current: current?.data ?? ({} as CurrentWeather),
    daily: daily?.forecast ?? ([] as Forecast[]),
    hourly: hourly?.forecast ?? ([] as Forecast[]),
    location: {
      city: current?.city,
      region: current?.region,
    },
  }
}
