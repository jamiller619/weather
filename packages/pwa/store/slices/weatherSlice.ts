import { UserLocation } from '@weather/base/models/User'
import Weather,{ CurrentWeather,Forecast } from '@weather/base/models/Weather'
import {parseObject} from '@weather/base/utils/JSONDateReviver'
import { SetState } from 'zustand'
import {API_URL} from '~/config'
import State from '~/store/State'
import Cache from './Cache'

type SerializedWeather = Weather & {
  fetchedAt?: Date
  locationId?: string
}

export type WeatherState = SerializedWeather & {
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

const cache = new Cache<SerializedWeather>(
  'weather.cache',
  window.sessionStorage
)

const getCurrentWeatherForLocation = (locationId: string): CurrentWeather => {
  // return cache.get(locationId)?.current ?? ({} as
  // CurrentWeather)
  return {} as CurrentWeather
}

const fetchWeather = (set: SetState<State>) => {
  return async (location: UserLocation): Promise<void> => {
    const { lat, lng, id } = location

    if (lat != null && lng != null) {
      const response = await fetch(`${API_URL}/weather/${lat},${lng}`)
      const data = parseObject((await response.json()) as Weather)
      const weather: SerializedWeather = {
        ...data,
        locationId: id,
        fetchedAt: new Date(),
      }
      // cache.set(id, weather, Date.now() + 1000 * 60 * 10)
      set((prev) => ({
        weather: {
          ...prev.weather,
          ...weather,
        },
      }))
    }
    // const cached = cache.get(id)

    // if (cached != null && cached?.fetchedAt != null) {
    //   set((prev) => ({
    //     weather: {
    //       ...prev.weather,
    //       ...cached,
    //     },
    //   }))
    // } else if (lat != null && lng != null) {
    //   const response = await fetch(`${API_URL}/weather/${lat},${lng}`)
    //   const data = parseObject((await response.json()) as Weather)
    //   const weather: SerializedWeather = {
    //     ...data,
    //     locationId: id,
    //     fetchedAt: new Date(),
    //   }

    //   cache.set(id, weather, Date.now() + 1000 * 60 * 10)

    //   set((prev) => ({
    //     weather: {
    //       ...prev.weather,
    //       ...weather,
    //     },
    //   }))
    // }
  }
}

export const createWeatherSlice = (
  set: SetState<State>
): Pick<State, 'weather'> => {
  return {
    weather: createState(set),
  }
}
