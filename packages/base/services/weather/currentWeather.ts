import toMilliseconds from '@sindresorhus/to-milliseconds'
import * as NWS from 'lib/nws'
import { CurrentWeather } from 'models/Weather'
import { parse as parseISODuration } from 'tinyduration'
import { toCelcius } from 'utils/convert'
import get from 'utils/get'
import { getGridInfo } from './gridInfo'

type ValidTimes = {
  startTime: Date
  endTime?: Date
}

const parseValidTime = (data: string): ValidTimes => {
  const parts = data.split('/')

  if (parts.length > 0) {
    const d = new Date(parts[0])

    if (parts?.[1] != null) {
      const duration = parseISODuration(parts[1])

      return {
        startTime: d,
        endTime: new Date(d.getTime() + toMilliseconds(duration)),
      }
    }

    return {
      startTime: d,
    }
  }

  return {
    startTime: new Date(data),
  }
}

const parseValue = (val?: number) => {
  if (val != null) {
    return Math.round(val)
  }
}

const getClosestValueToDate = (
  testDate: Date,
  data?: NWS.GridPointsProperty
) => {
  if (data != null && data.values != null && data.values.length > 0) {
    const parsed = data.values.map((v) => ({
      ...parseValidTime(v.validTime as string),
      value: parseValue(v.value) as number,
    }))

    const start = parsed.findIndex((pv) => {
      return (
        pv.startTime < testDate && pv.endTime != null && pv.endTime > testDate
      )
    })

    return parsed[start < 0 ? 0 : start]
  }
}

const convert = (
  value: number | undefined,
  isCelcius: boolean
): number | undefined => {
  if (value != null) {
    return isCelcius ? value : toCelcius(value)
  }
}

const isCelcius = (data?: NWS.GridPointsProperty): boolean => {
  if (data?.uom?.includes('degC')) {
    return true
  }

  return false
}

const mapCurrentWeather = (
  data?: NWS.GridPointsResponse
): CurrentWeather | undefined => {
  const { properties } = data || {}

  if (
    properties != null &&
    properties.temperature != null &&
    properties.maxTemperature != null &&
    properties.minTemperature != null &&
    properties.apparentTemperature != null
  ) {
    const now = new Date()
    const isCelc = isCelcius(properties.temperature)

    const high = getClosestValueToDate(now, properties.maxTemperature)
    const low = getClosestValueToDate(now, properties.minTemperature)
    const temp = getClosestValueToDate(now, properties.temperature)
    const feelsLike = getClosestValueToDate(now, properties.apparentTemperature)
    const windChill = getClosestValueToDate(now, properties.windChill)
    const humidity = getClosestValueToDate(now, properties.relativeHumidity)
    const windSpeed = getClosestValueToDate(now, properties.windSpeed)
    const skyCover = getClosestValueToDate(now, properties.skyCover)
    const windGust = getClosestValueToDate(now, properties.windGust)

    const vals = [
      high,
      low,
      temp,
      feelsLike,
      windChill,
      humidity,
      windSpeed,
      skyCover,
      windGust,
    ]

    const endTime = Math.max(
      ...(vals.map((v) => v?.endTime?.getTime()) as number[])
    )
    const startTime = Math.min(
      ...(vals.map((v) => v?.startTime?.getTime()) as number[])
    )

    return {
      endTime: new Date(endTime),
      startTime: new Date(startTime),
      high: convert(high?.value, isCelc),
      low: convert(low?.value, isCelc),
      temp: convert(temp?.value, isCelc),
      feelsLike: convert(feelsLike?.value, isCelc),
      unit: isCelc ? 'C' : 'F',
      windChill: convert(windChill?.value, isCelc),
      humidity: humidity?.value,
      windSpeed: windSpeed?.value,
      skyCover: skyCover?.value,
      windGust: windGust?.value,
    } as CurrentWeather
  }
}

export const getCurrentWeather = async (lat: number, lng: number) => {
  const gridInfo = await getGridInfo(lat, lng)

  if (gridInfo != null && gridInfo.currentWeather != null) {
    const response = await get<NWS.GridPointsResponse>(gridInfo.currentWeather)

    if (response != null) {
      const data = mapCurrentWeather(response)

      if (data != null) {
        return {
          data,
          city: gridInfo.city,
          region: gridInfo.region,
        }
      }
    }
  }
}
