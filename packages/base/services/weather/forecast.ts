import * as NWS from 'lib/nws'
import { Forecast } from 'models/Weather'
import { toCelcius } from 'utils/convert'
import get from 'utils/get'
import { getGridInfo } from './gridInfo'

const convertTemp = (temp?: number, unit?: 'C' | 'F') => {
  if (temp != null && unit != null) {
    return unit === 'C' ? temp : toCelcius(temp)
  }
}

const mapForecast = (data?: NWS.Period): Forecast | undefined => {
  if (data?.startTime != null) {
    return {
      startTime: new Date(data.startTime),
      endTime: data.endTime != null ? new Date(data.endTime) : undefined,
      isDay: data.isDaytime,
      temp: convertTemp(
        data.temperature,
        data.temperatureUnit === 'F' ? 'F' : 'C'
      ),
      unit: 'C',
      description: data.detailedForecast,
      windSpeedDescription: data.windSpeed,
      shortDescription: data.shortForecast,
      periodName: data.name,
    }
  }
}

export const getHourlyForecast = async (lat: number, lng: number) => {
  const gridInfo = await getGridInfo(lat, lng)

  if (gridInfo != null && gridInfo.forecastHourly != null) {
    const response = await get<NWS.GridPointsForecastHourlyResponse>(
      gridInfo.forecastHourly
    )

    if (response?.properties?.periods != null) {
      const data = response.properties.periods
        .map(mapForecast)
        .filter((v) => v != null) as Forecast[] | undefined

      if (data != null) {
        return {
          city: gridInfo.city,
          region: gridInfo.region,
          forecast: data,
        }
      }
    }
  }
}

export const getDailyForecast = async (lat: number, lng: number) => {
  const gridInfo = await getGridInfo(lat, lng)

  if (gridInfo != null && gridInfo.forecastDaily != null) {
    const response = await get<NWS.GridPointsForecastResponse>(
      gridInfo.forecastDaily
    )

    if (response?.properties?.periods != null) {
      const data = response.properties.periods
        .map(mapForecast)
        .filter((v) => v != null) as Forecast[] | undefined

      if (data != null) {
        return {
          city: gridInfo.city,
          region: gridInfo.region,
          forecast: data,
        }
      }
    }
  }
}
