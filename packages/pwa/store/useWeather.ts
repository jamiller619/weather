import Weather from '@weather/base/models/Weather'
import { useEffect } from 'react'
import { State } from 'store'
import useActiveLocation from 'store/useActiveLocation'
import shallow from 'zustand/shallow'
import { WeatherState } from './slices/weatherSlice'
import useStore from './useStore'

const selector = (state: State) => state.weather

const shouldFetchWeather = (
  state?: WeatherState,
  activeLocationId?: string
) => {
  if (
    activeLocationId == null ||
    state?.fetchedAt == null ||
    (activeLocationId != null && state?.locationId !== activeLocationId)
  ) {
    return true
  }

  const diff = Date.now() - state.fetchedAt.getTime()

  return diff > 1000 * 60 * 5
}

export default function useWeather(): Weather {
  const state = useStore(selector, shallow)
  const activeLocation = useActiveLocation()

  const { current, daily, hourly, fetchWeather } = state

  useEffect(() => {
    const { lat, lng, id } = activeLocation

    if (lat != null && lng != null && shouldFetchWeather(state, id)) {
      fetchWeather(activeLocation)
    }
  }, [activeLocation, fetchWeather, state])

  return {
    current,
    daily,
    hourly,
  }
}
