import { useMemo } from 'react'

import { useWeather } from '~/store'

import Column from './Column'
import Tile from './Tile'

const formatToHour = (date?: Date) => {
  if (!date || !(date instanceof Date)) return ''

  const h = date.getHours()
  const h2 = h % 12

  return `${(h2 === 0 ? 12 : h2).toString().padStart(2, '0')} ${
    h < 12 ? 'AM' : 'PM'
  }`
}

const formatTime = (time: Date) => formatToHour(time).toString()

export default function Hourly(): JSX.Element {
  const state = useWeather()
  const hourly = useMemo(() => state?.hourly?.slice(0, 4) ?? [], [state])

  return (
    <Tile title="Hourly">
      {hourly.map((data) => (
        <Column
          key={data.startTime?.getTime?.()}
          title={formatTime(data.startTime)}
          forecast={data}
        />
      ))}
    </Tile>
  )
}
