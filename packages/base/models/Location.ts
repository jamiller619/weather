import { nanoid } from 'nanoid'

type LocationSource = 'browser' | 'ip' | 'lookup'

export type Locations = {
  [id: string]: Location
}

export default interface Location {
  id: string
  gridId?: string
  gridX?: number
  gridY?: number
  lat?: number
  lng?: number
  city?: string | null
  region?: string | null
  source: LocationSource
}

export const createLocation = (
  source: LocationSource,
  data: Partial<Location>
): Location => ({
  ...data,
  source,
  id: nanoid(8),
})
