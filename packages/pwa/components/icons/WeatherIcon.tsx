import styled from 'styled-components'
import conditionsMap, { ConditionsMap, IconMap } from './weather/conditionsMap'
import weatherIcons from './weather/icons'

const Icon = styled.span`
  font-family: 'weather-icons', sans-serif;
  font-size: 42px;
  display: block;
  margin: 1.5rem 0;
`

const defaultIcon = weatherIcons.clouds

const findMatch = (
  search: string,
  map: ConditionsMap,
  initialValue?: IconMap
): IconMap | undefined => {
  search = search.toLowerCase()

  const match = Object.keys(map || {}).find((c) => search.includes(c))

  if (match != null && map[match] != null) {
    if (map[match].sub != null) {
      return findMatch(search, map[match].sub as ConditionsMap, map[match])
    }

    return map[match]
  }

  if (initialValue != null) {
    return initialValue
  }
}

export const getIconFromForecast = (
  forecast?: string,
  isDay?: boolean
): number | undefined => {
  if (forecast == null || forecast?.trim() === '') {
    return
  }

  const match = findMatch(forecast, conditionsMap)

  if (match != null) {
    if (isDay === true && match.day != null) {
      return match.day
    }

    if (isDay === false && match.night != null) {
      return match.night
    }

    return match.icon
  }
}

type WeatherIconProps = {
  forecast?: string
  isDay?: boolean
}

const getIcon = (forecast?: string, isDay?: boolean) => {
  const icon = getIconFromForecast(forecast, isDay)

  if (icon != null) {
    return icon
  }

  if (isDay === true) {
    return weatherIcons.sun
  } else if (isDay === false) {
    return weatherIcons.moon
  }

  return defaultIcon
}

export default function WeatherIcon({
  forecast,
  isDay,
}: WeatherIconProps): JSX.Element {
  return <Icon>{String.fromCharCode(getIcon(forecast, isDay))}</Icon>
}
