import Weather, { CurrentWeather, Forecast } from '@weather/base/models/Weather'
import { parseObject } from '@weather/base/utils/JSONDateReviver'
import { API_URL } from 'config'
import State from 'store/State'
import { SetState } from 'zustand'

export default interface WeatherState extends Weather {
  fetchedAt?: Date
  fetchWeather: (lat?: number, lng?: number) => Promise<void>
}

const fetchWeather = (set: SetState<State>) => {
  return async (lat?: number, lng?: number): Promise<void> => {
    if (lat != null && lng != null) {
      const response = await fetch(`${API_URL}/weather/${lat},${lng}`)
      const data = parseObject((await response.json()) as Weather)

      set((prev) => ({
        weather: {
          ...prev.weather,
          ...data,
          fetchedAt: new Date(),
        },
      }))
    }
  }
}

export const createWeatherSlice = (
  set: SetState<State>
): Pick<State, 'weather'> => {
  return {
    weather: {
      current: {} as CurrentWeather,
      daily: [] as Forecast[],
      hourly: [] as Forecast[],
      location: {},

      fetchWeather: fetchWeather(set),
    },
  }
}
