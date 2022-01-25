import Location from './Location'

export enum TempTrend {
  Rising = 0,
  Falling = 1,
  Neutral = 2,
  RisingFast = 3,
  FallingFast = 4,
}

export type WeatherData = {
  endTime?: Date
  startTime: Date
  temp?: number
  unit?: 'F' | 'C'
  trend?: TempTrend
  description?: string
  windSpeed?: number
  windSpeedDescription?: string
}

export type CurrentWeather = WeatherData & {
  high?: number
  low?: number
  feelsLike?: number
  humidity?: number
  skyCover?: number
  windChill?: number
  windGust?: number
}

export type Forecast = WeatherData & {
  shortDescription?: string
  isDay?: boolean
  periodName?: string
}

export default interface Weather {
  current: CurrentWeather
  daily: Forecast[]
  hourly: Forecast[]
  location: Partial<Location>
}
