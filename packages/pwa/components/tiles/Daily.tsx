import shallow from 'zustand/shallow'
import { State, useStore } from '~/store'
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

const selector = (state: State) => state.weather.daily.slice(0, 4)

export default function Daily(): JSX.Element {
  const forecast = useStore(selector, shallow)

  return (
    <Tile title="Daily">
      {forecast.map((data) => (
        <Column
          key={data.startTime?.getTime?.()}
          title={formatToShortDay(data.periodName)}
          forecast={data}
        />
      ))}
    </Tile>
  )
}
