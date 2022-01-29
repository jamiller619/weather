import { Fragment, ReactNode, useEffect } from 'react'
import useIsMounted from '~/hooks/useIsMounted'
import getCurrentLocation from '~/location/getCurrentLocation'
import { State, useStore } from '~/store'

type StoreProviderProps = {
  children: ReactNode
}

const selector = (state: State) => state.user

export default function StoreProvider({
  children,
}: StoreProviderProps): JSX.Element {
  const isMounted = useIsMounted()
  const { activeLocationId, addLocation } = useStore(selector)

  useEffect(() => {
    if (activeLocationId == null) {
      getCurrentLocation().then((currentLocation) => {
        if (isMounted() && currentLocation != null) {
          addLocation(
            {
              ...currentLocation,
              isCurrent: true,
            },
            true
          )
        }
      })
    }
  }, [activeLocationId, addLocation, isMounted])

  return <Fragment>{children}</Fragment>
}
