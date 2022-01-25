import useIsMounted from 'hooks/useIsMounted'
import { Fragment, ReactNode, useEffect, useState } from 'react'
import { State, useStore } from 'store'
import shallow from 'zustand/shallow'

type StoreProviderProps = {
  children: ReactNode
}

const selector = (state: State) => ({
  activeLocationId: state.user.activeLocationId,
  addLocation: state.user.addLocation,
  getActiveLocation: state.user.getActiveLocation,
})

export default function StoreProvider({
  children,
}: StoreProviderProps): JSX.Element {
  const { activeLocationId, addLocation, getActiveLocation } = useStore(
    selector,
    shallow
  )
  const isMounted = useIsMounted()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (activeLocationId == null) {
      getActiveLocation().then((activeLocation) => {
        if (isMounted()) {
          if (activeLocation != null) {
            addLocation(activeLocation, true)
          } else {
            setError('Unable to find a location')
          }
        }
      })
    }
  }, [activeLocationId, addLocation, getActiveLocation, isMounted])

  return <Fragment>{error != null ? <p>{error}</p> : children}</Fragment>
}
