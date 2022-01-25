import { State, useStore } from 'store'
import shallow from 'zustand/shallow'
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

const selector = (state: State) => state.weather.hourly.slice(0, 4)

export default function Hourly(): JSX.Element {
  const forecast = useStore(selector, shallow)

  return (
    <Tile title="Hourly">
      {forecast.map((data) => (
        <Column
          key={data.startTime?.getTime?.()}
          title={formatTime(data.startTime)}
          forecast={data}
        />
      ))}
    </Tile>
  )
}
