type ImportMeta = {
  env: {
    DEV: boolean
    PROD: boolean
    PUBLIC_API_URL: string
    PUBLIC_IPINFO_TOKEN: string
    PUBLIC_NWS_UA: string
    PUBLIC_GOOGLE_API_KEY: string
    PUBLIC_MAPBOX_TOKEN: string
    PUBLIC_MAPBOX_STYLE: string
  }
}

export const IPINFO_TOKEN = (import.meta as unknown as ImportMeta).env
  .PUBLIC_IPINFO_TOKEN

export const NWS_UA = (import.meta as unknown as ImportMeta).env.PUBLIC_NWS_UA
export const API_URL = (import.meta as unknown as ImportMeta).env.PUBLIC_API_URL
export const GOOGLE_API_KEY = (import.meta as unknown as ImportMeta).env
  .PUBLIC_GOOGLE_API_KEY
export const MAPBOX_TOKEN = (import.meta as unknown as ImportMeta).env
  .PUBLIC_MAPBOX_TOKEN
export const MAPBOX_STYLE = (import.meta as unknown as ImportMeta).env
  .PUBLIC_MAPBOX_STYLE
