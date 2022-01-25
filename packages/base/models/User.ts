import { nanoid } from 'nanoid'
import Location from './Location'

export type UserSettings = {
  theme: 'dark' | 'light' | 'system'
  units: 'F' | 'C'
  autoDetectCurrentLocation: boolean
}

export default interface User {
  id: string
  locations: {
    [id: string]: Location
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
