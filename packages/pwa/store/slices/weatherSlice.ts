import { UserLocation } from '@weather/base/models/User'
import Weather, { CurrentWeather, Forecast } from '@weather/base/models/Weather'
import { parseObject } from '@weather/base/utils/JSONDateReviver'
import { API_URL } from 'config'
import State from 'store/State'
import { SetState } from 'zustand'
import Cache from './Cache'

export type WeatherState = Weather & {
  fetchedAt?: Date
  locationId?: string
  fetchWeather: (location: UserLocation) => Promise<void>
  getCurrentWeatherForLocation: (locationId: string) => CurrentWeather
}

const createState = (set: SetState<State>) => ({
  current: {} as CurrentWeather,
  daily: [] as Forecast[],
  hourly: [] as Forecast[],
  fetchWeather: fetchWeather(set),
  getCurrentWeatherForLocation,
})

const cache = new Cache<WeatherState>('weather.cache', window.sessionStorage)

const getCurrentWeatherForLocation = (locationId: string): CurrentWeather => {
  return cache.get(locationId)?.current ?? ({} as CurrentWeather)
}

const fetchWeather = (set: SetState<State>) => {
  return async (location: UserLocation): Promise<void> => {
    const { lat, lng, id } = location
    const cached = cache.get(id)

    if (cached != null && cached?.fetchedAt != null) {
      set({
        weather: {
          ...createState(set),
          ...cached,
        },
      })
    } else if (lat != null && lng != null) {
      const response = await fetch(`${API_URL}/weather/${lat},${lng}`)
      const data = parseObject((await response.json()) as Weather)
      const weather = {
        ...createState(set),
        ...data,
        locationId: id,
        fetchedAt: new Date(),
      }

      cache.set(id, weather, Date.now() + 1000 * 60 * 10)

      set({
        weather,
      })
    }
  }
}

export const createWeatherSlice = (
  set: SetState<State>
): Pick<State, 'weather'> => {
  return {
    weather: createState(set),
  }
}
