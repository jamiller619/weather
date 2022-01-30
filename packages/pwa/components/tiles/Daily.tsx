import { useMemo } from 'react'
import { useWeather } from '~/store'
import Column from './Column'
import Tile from './Tile'

type DayNamesMap = {
  [key: string]: string
}

const dayNamesMap: DayNamesMap = {
  Sunday: 'Sun',
  Monday: 'Mon',
  Tuesday: 'Tue',
  Wednesday: 'Wed',
  Thursday: 'Thu',
  Friday: 'Fri',
  Saturday: 'Sat',
}

const dayNamesMapKeys = Object.keys(dayNamesMap)

const formatToShortDay = (title = '') => {
  return dayNamesMapKeys.reduce((result, key) => {
    return result.replace(key, dayNamesMap[key])
  }, title)
}

export default function Daily(): JSX.Element {
  const state = useWeather()
  const daily = useMemo(() => state?.hourly?.slice(0, 4) ?? [], [state])

  return (
    <Tile title="Daily">
      {daily.map((data) => (
        <Column
          key={data.startTime?.getTime?.()}
          title={formatToShortDay(data.periodName)}
          forecast={data}
        />
      ))}
    </Tile>
  )
}
