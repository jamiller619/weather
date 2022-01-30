import { SetState } from 'zustand'

import { UserLocation } from '@weather/base/models/User'
import Weather from '@weather/base/models/Weather'
import { parseObject } from '@weather/base/utils/JSONDateReviver'

import { API_URL } from '~/config'
import State from '~/store/State'
import get from '~/utils/get'

import Cache from './Cache'

export type FetchedWeather = Weather & {
  fetchedAt?: Date
}

export type LocationWeather = {
  [locationId: string]: FetchedWeather
}

export type WeatherState = {
  data: LocationWeather
  fetchWeather: (location: UserLocation) => Promise<void>
}

const cache = new Cache<FetchedWeather>('weather.cache', window.sessionStorage)

const createState = (set: SetState<State>): WeatherState => ({
  data:
    cache.getAll()?.reduce((result, current) => {
      const { key: id, value } = current

      result[id] = value

      return result
    }, {} as LocationWeather) ?? {},
  fetchWeather: fetchWeather(set),
})

const fetchWeather = (set: SetState<State>) => {
  return async (location: UserLocation): Promise<void> => {
    // We use to have a check here for cached data, but
    // since we're now getting that cache on the initial
    // create, another check here would be redundant.
    const { lat, lng, id } = location

    if (lat != null && lng != null) {
      try {
        set({
          isFetching: true,
        })

        const response = await get<Weather>(`${API_URL}/weather/${lat},${lng}`)
        const data = parseObject<Weather>(response ?? ({} as Weather))
        const weather: FetchedWeather = {
          ...data,
          fetchedAt: new Date(),
        }

        cache.set(id, weather, Date.now() + 1000 * 60 * 10)

        set((prev) => ({
          user: {
            ...prev.user,
            locations: {
              ...prev.user.locations,
              [id]: {
                ...prev.user.locations[id],
                ...data.location,
              },
            },
          },
          weather: {
            ...prev.weather,
            data: {
              ...prev.weather.data,
              [id]: weather,
            },
          },
        }))
      } catch (err) {
        console.error(err)
      } finally {
        set({
          isFetching: false,
        })
      }
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
