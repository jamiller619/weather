import Weather from '@weather/base/models/Weather'
import { useEffect } from 'react'
import { State } from '~/store'
import useActiveLocation from '~/store/useActiveLocation'
import { FetchedWeather } from './slices/weatherSlice'
import useStore from './useStore'

const selector = (state: State) => state.weather

const shouldFetchWeather = (state?: FetchedWeather) => {
  if (state?.fetchedAt == null) {
    return true
  }

  const diff = Date.now() - state.fetchedAt.getTime()

  return diff > 1000 * 60 * 5
}

export default function useWeather(): Weather | undefined {
  const { data, fetchWeather } = useStore(selector)
  const activeLocation = useActiveLocation()
  const { lat, lng } = activeLocation
  const weather = data[activeLocation.id]

  useEffect(() => {
    if (
      weather == null &&
      lat != null &&
      lng != null &&
      shouldFetchWeather(weather)
    ) {
      fetchWeather(activeLocation)
    }
  })

  return weather
}
