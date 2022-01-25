import Location, { createLocation } from '@weather/base/models/Location'
import { getLocationFromIP } from '@weather/base/services/IPInfoService'
import { IPINFO_TOKEN } from 'config'
import { useEffect } from 'react'
import shallow from 'zustand/shallow'
import State, { Store } from './State'
import useStore from './useStore'

const selector = (state: State) => ({
  location: state.user.locations[state.user.activeLocationId ?? 0] ?? {},
  editLocation: state.user.editLocation,
})

export const useActiveLocation = (data?: Partial<Location>) => {
  const { location, editLocation } = useStore(selector, shallow)

  useEffect(() => {
    if (data != null && location?.id != null) {
      editLocation(location.id, data)
    }
  }, [data, editLocation, location])

  return location
}

export const getActiveLocation = async (): Promise<Location | undefined> => {
  const loc1 = getLocationFromCache()

  if (loc1 != null) {
    return Promise.resolve(loc1)
  }

  const loc2 = await getLocationFromBrowser()

  if (loc2 != null) {
    return loc2
  }

  return getLocationFromIP(IPINFO_TOKEN)
}

const getLocationFromCache = (): Location | undefined => {
  const weather = localStorage.getItem('weather')

  if (weather != null) {
    const data = JSON.parse(weather) as Store

    if (data?.state?.user?.activeLocationId != null) {
      return data.state.user.locations[data.state.user.activeLocationId]
    }
  }
}

const getLocationFromBrowser = (): Promise<Location | undefined> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation not supported'))
    }

    const handleSuccess = ({ coords }: GeolocationPosition) => {
      const location = createLocation('browser', {
        lat: coords.latitude,
        lng: coords.longitude,
      })

      resolve(location)
    }

    navigator.geolocation.getCurrentPosition(handleSuccess, reject)
  })
}