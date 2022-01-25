import Location from '@weather/base/models/Location'
import User, { createUser, UserSettings } from '@weather/base/models/User'
import { getActiveLocation as fetchActiveLocation } from 'store/activeLocation'
import State from 'store/State'
import { GetState, SetState } from 'zustand'

export default interface UserState extends User {
  activeLocationId?: string
  getActiveLocation: () => Promise<Location | undefined>
  setActiveLocationId: (locationId: string) => void
  addLocation: (location: Location, isActive?: boolean) => void
  removeLocation: (locationId: string) => void
  editLocation: (locationId: string, location: Partial<Location>) => void
  saveSettings: (settings: Partial<UserSettings>) => void
}

const addLocation = (set: SetState<State>) => {
  return (location: Location, isActive = false): void => {
    set((prev) => ({
      user: {
        ...prev.user,
        locations: {
          ...prev.user.locations,
          [location.id]: location,
        },
        activeLocationId: isActive ? location.id : prev.user.activeLocationId,
      },
    }))
  }
}

const getActiveLocation = (get: GetState<State>) => {
  return async (): Promise<Location | undefined> => {
    const { user } = get()

    if (user.activeLocationId != null) {
      return user.locations[user.activeLocationId]
    }

    return fetchActiveLocation()
  }
}

const setActiveLocationId = (set: SetState<State>) => {
  return (locationId: string) => {
    set((prev) => ({
      user: {
        ...prev.user,
        activeLocationId: locationId,
      },
    }))
  }
}

const removeLocation = (set: SetState<State>) => {
  return (locationId: string): void => {
    set((prev) => {
      const locations = { ...prev.user.locations }

      delete locations[locationId]

      return {
        user: {
          ...prev.user,
          locations,
        },
      }
    })
  }
}

const saveSettings = (set: SetState<State>) => {
  return (settings: Partial<UserSettings>) => {
    set((prev) => ({
      user: {
        ...prev.user,
        settings: {
          ...prev.user.settings,
          ...settings,
        },
      },
    }))
  }
}

const editLocation = (set: SetState<State>) => {
  return (locationId: string, location: Partial<Location>): void => {
    set((prev) => {
      const loc = prev.user.locations[locationId]

      if (loc != null) {
        loc.city = location.city ?? loc.city
        loc.region = location.region ?? loc.region
      }

      return {
        user: {
          ...prev.user,
          locations: {
            ...prev.user.locations,
            [locationId]: loc,
          },
        },
      }
    })
  }
}

export const createUserSlice = (set: SetState<State>, get: GetState<State>) => {
  return {
    user: {
      ...createUser(),
      getActiveLocation: getActiveLocation(get),
      setActiveLocationId: setActiveLocationId(set),
      addLocation: addLocation(set),
      removeLocation: removeLocation(set),
      editLocation: editLocation(set),
      saveSettings: saveSettings(set),
    },
  }
}
