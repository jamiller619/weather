import Weather from '@weather/base/models/Weather'
import { useEffect } from 'react'
import { State } from 'store'
import { useActiveLocation } from './activeLocation'
import WeatherState from './slices/WeatherState'
import useStore from './useStore'

const selector = (state: State) => state.weather

const comparer = (a: WeatherState, b: WeatherState) => {
  return a.fetchedAt === b.fetchedAt
}

export default function useWeather(): Weather {
  const store = useStore(selector, comparer)
  const { lat, lng } = useActiveLocation()
  const { current, daily, hourly, fetchWeather, fetchedAt, location } = store

  useEffect(() => {
    if (lat != null && lng != null && fetchedAt == null) {
      fetchWeather(lat, lng)
    }
  }, [fetchWeather, fetchedAt, lat, lng])

  return {
    current,
    daily,
    hourly,
    location,
  }
}
