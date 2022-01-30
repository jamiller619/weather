import { Fragment, ReactNode, useEffect } from 'react'
import shallow from 'zustand/shallow'

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
  const { activeLocationId, setActiveLocation } = useStore(selector, shallow)

  useEffect(() => {
    if (activeLocationId == null) {
      getCurrentLocation().then((location) => {
        if (isMounted() && location != null) {
          setActiveLocation(location.id, {
            ...location,
            isCurrent: true,
          })
        }
      })
    }
  }, [activeLocationId, isMounted, setActiveLocation])

  return <Fragment>{children}</Fragment>
}
