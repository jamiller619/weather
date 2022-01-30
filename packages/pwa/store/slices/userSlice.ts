import User, {
  createUser,
  UserLocation,
  UserSettings,
} from '@weather/base/models/User'
import { SetState } from 'zustand'
import State from '~/store/State'

export type UserState = User & {
  activeLocationId?: string
  setActiveLocation: (id: string, data?: Partial<UserLocation>) => void
  addLocation: (location: UserLocation) => void
  removeLocation: (locationId: string) => void
  // editLocation: (locationId: string, location: Partial<UserLocation>) => void
  saveSettings: (settings: Partial<UserSettings>) => void
}

const addLocation = (set: SetState<State>) => {
  return (location: UserLocation): void => {
    set((prev) => ({
      user: {
        ...prev.user,
        locations: {
          ...prev.user.locations,
          [location.id]: location,
        },
        // activeLocationId: isActive ? location.id : prev.user.activeLocationId,
      },
    }))
  }
}

const setActiveLocation = (set: SetState<State>) => {
  return (id: string, data?: Partial<UserLocation>) => {
    if (data != null) {
      set((prev) => ({
        user: {
          ...prev.user,
          locations: {
            ...prev.user.locations,
            [id]: {
              ...prev.user.locations[id],
              ...data,
            },
          },
          activeLocationId: id,
        },
      }))
    } else {
      set((prev) => ({
        user: {
          ...prev.user,
          activeLocationId: id,
        },
      }))
    }
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

// const editLocation = (set: SetState<State>) => {
//   return (locationId: string, location: Partial<UserLocation>): void => {
//     set((prev) => {
//       const loc = prev.user.locations[locationId]

//       if (loc != null) {
//         loc.city = location.city ?? loc.city
//         loc.region = location.region ?? loc.region
//       }

//       return {
//         user: {
//           ...prev.user,
//           locations: {
//             ...prev.user.locations,
//             [locationId]: loc,
//           },
//         },
//       }
//     })
//   }
// }

export const createUserSlice = (set: SetState<State>) => {
  return {
    user: {
      ...createUser(),
      setActiveLocation: setActiveLocation(set),
      addLocation: addLocation(set),
      removeLocation: removeLocation(set),
      // editLocation: editLocation(set),
      saveSettings: saveSettings(set),
    },
  }
}
