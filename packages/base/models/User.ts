import { nanoid } from 'nanoid'
import Location from './Location'

export type UserSettings = {
  theme: 'dark' | 'light' | 'system'
  units: 'F' | 'C'
  autoDetectCurrentLocation: boolean
}

export type UserLocation = Location & {
  isCurrent?: boolean
}

export default interface User {
  id: string
  locations: {
    [id: string]: UserLocation
  }
  settings: UserSettings
}

export const createUser = (): User => {
  return {
    id: nanoid(8),
    locations: {},
    settings: {
      theme: 'system',
      units: 'F',
      autoDetectCurrentLocation: true,
    },
  }
}
