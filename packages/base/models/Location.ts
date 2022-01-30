import { nanoid } from 'nanoid'

type LocationSource = 'browser' | 'ip' | 'lookup'

export type Locations = {
  [id: string]: Location
}

export type LocationMeta = {
  city?: string
  region?: string
}

export default interface Location extends LocationMeta {
  id: string
  gridId?: string
  gridX?: number
  gridY?: number
  lat?: number
  lng?: number
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
