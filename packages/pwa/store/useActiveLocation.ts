import { UserLocation } from '@weather/base/models/User'
import { useEffect, useMemo } from 'react'
import shallow from 'zustand/shallow'
import { State, useStore } from '~/store'

const selector = (state: State) => ({
  locations: state.user.locations,
  activeLocationId: state.user.activeLocationId,
  editLocation: state.user.editLocation,
})

export default function useActiveLocation(data?: Partial<UserLocation>) {
  const { locations, activeLocationId, editLocation } = useStore(
    selector,
    shallow
  )

  useEffect(() => {
    if (data != null && activeLocationId != null) {
      editLocation(activeLocationId, data)
    }
  }, [data, editLocation, activeLocationId])

  const activeLocation = useMemo(() => {
    return activeLocationId == null
      ? ({} as UserLocation)
      : locations[activeLocationId]
  }, [locations, activeLocationId])

  return activeLocation
}
