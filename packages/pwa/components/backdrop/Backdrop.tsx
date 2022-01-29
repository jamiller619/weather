import { useEffect } from 'react'
import styled from 'styled-components'
import SunCalc from 'suncalc'
import useActiveLocation from '~/store/useActiveLocation'

type SunEvents = {
  sunrise: Date
  sunset: Date
  dusk: Date
  dawn: Date
  night: Date
}

const colors = {
  sunrise: '#cc9ac5',
  dawn: '#9cb3c8',
  dusk: '#fabf83',
  sunset: '#f28f91',
  night: '#02061c',
}

const getSunEvents = (
  lat: number,
  lng: number,
  date = new Date()
): SunEvents => {
  const { sunrise, sunset, dusk, dawn, night } = SunCalc.getTimes(
    date,
    lat,
    lng
  )

  return {
    sunrise,
    sunset,
    dusk,
    dawn,
    night,
  }
}

const Container = styled.div<{ backgroundColor?: string }>`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: ${(props) => props.backgroundColor};
  z-index: -1;
`

export default function Backdrop(): JSX.Element {
  const { lat, lng } = useActiveLocation()
  // const weather = useWeather()
  // const [sunEvents, setSunEvents] = useState<SunEvents>()

  // const buildGradient = (lat: number, lng: number) => {
  //   const now = new Date()
  //   const sunEvents = getSunEvents(lat, lng)
  // }

  useEffect(() => {
    if (lat != null && lng != null) {
      // setSunEvents(getSunEvents(lat, lng))
    }
  }, [lat, lng])

  return <Container />
}
