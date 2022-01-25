export type StationsResponse = {
  features?: Array<{
    id?: string
    geometry?: {
      type?: string
      coordinates?: [number, number]
    }
    properties?: {
      '@id'?: string
      stationIdentifier?: string
      name?: string
      timeZone?: string
      forecast?: string
      county?: string
      fireWeatherZone?: string
    }
  }>
}

export type AlertsResponse = {
  features?: Array<{
    id?: string
    properties?: {
      '@id'?: string
      areaDesc?: string
      sent?: Date
      effective?: Date
      onset?: Date
      expires?: Date
      ends?: Date
      status?: string
      messageType?: string
      category?: string
      severity?: string
      certainty?: string
      urgency?: string
      event?: string
      sender?: string
      senderName?: string
      headline?: string
      description?: string
      instruction?: string
      eventEndingTime?: Date[]
    }
  }>
}

export type PointsResponse = {
  properties?: {
    gridId?: string
    gridX?: number
    gridY?: number
    forecast?: string
    forecastHourly?: string
    forecastGridData?: string
    radarStation?: string
    forecastZone?: string
    county?: string
    fireWeatherZone?: string
    timeZone?: string
    relativeLocation?: {
      properties?: {
        city?: string
        state?: string
      }
    }
  }
}

export type GridPointsProperty = {
  uom?: string
  values?: Array<{
    validTime?: string
    value?: number
  }>
}

export type GridPointsGeometry = {
  type?: string
  coordinates?: [[number, number]]
}

export type GridPointsResponse = {
  geometry?: GridPointsGeometry
  properties?: {
    updateTime?: string
    validTimes?: string
    forecastOffice?: string
    gridId?: string
    gridX?: string
    gridY?: string
    temperature?: GridPointsProperty
    dewpoint?: GridPointsProperty
    maxTemperature?: GridPointsProperty
    minTemperature?: GridPointsProperty
    relativeHumidity?: GridPointsProperty
    apparentTemperature?: GridPointsProperty
    heatIndex?: GridPointsProperty
    windChill?: GridPointsProperty
    skyCover?: GridPointsProperty
    windDirection?: GridPointsProperty
    windSpeed?: GridPointsProperty
    windGust?: GridPointsProperty
    hazards?: GridPointsProperty
    snowfallAmount?: GridPointsProperty
    snowLevel?: GridPointsProperty
    visibility?: GridPointsProperty
  }
}

export type CurrentWeather = GridPointsResponse

export type Period = {
  number?: number
  name?: string
  startTime?: string
  endTime?: string
  isDaytime?: boolean
  temperature?: number
  temperatureUnit?: string
  temperatureTrend?: null
  windSpeed?: string
  windDirection?: string
  shortForecast?: string
  detailedForecast?: string
}

export type GridPointsForecastResponse = {
  geometry?: GridPointsGeometry
  properties?: {
    updated?: string
    units?: string
    forecastGenerator?: string
    generatedAt?: string
    updateTime?: string
    validTimes?: string
    periods?: Period[]
  }
}

export type DailyForecast = GridPointsForecastResponse

export type GridPointsForecastHourlyResponse = {
  geometry?: GridPointsGeometry
  properties?: {
    updated?: string
    units?: string
    forecastGenerator?: string
    generatedAt?: string
    updateTime?: string
    validTimes?: string
    periods?: Period[]
  }
}
