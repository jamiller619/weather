import { MAPBOX_STYLE, MAPBOX_TOKEN } from 'config'
import Leaflet, { LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'mapbox-gl-leaflet'
import 'mapbox-gl/dist/mapbox-gl.css'
import React, { useState } from 'react'
import {
  MapContainer as RLMapContainer,
  Marker,
  useMap,
  WMSTileLayer,
} from 'react-leaflet'
import { useActiveLocation } from 'store'
import styled from 'styled-components'
import Tile from './Tile'

const ZOOM = 11
const INTERVALS = 10
const INTERVAL_DURATION_HOURS = 5
const NEXRAD_URL =
  'https://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0q.cgi'
const NEXRAD_LAYER = 'nexrad-n0q-900913' // 90013 refers to Spherical Mercator
const LAYER_OPACITY = 0.575

const getSuffix = (time: number) => {
  if (time === 0) {
    return ''
  }

  if (time === 5) {
    return '-m05m'
  }

  return `-m${time}m`
}

const Container = styled.div`
  border-radius: 1rem;
  /* margin: 0.5rem 1rem; */
  padding: 0;
  height: calc(100% - 1rem);
  width: calc(100% - 2rem);
  overflow: hidden;
  pointer-events: none;
`

const MapContainer = styled(RLMapContainer)`
  flex-direction: column;
  width: 100%;
  height: 100%;
  /* height: calc(100% - 2rem); */
  /* margin-top: -1rem; */
  // Using !important here is necessary since something else,
  // presumably Leaflet, sets this to position: relative in js,
  // screwing up the layout...
  position: initial !important;
`

type TimeLayerProps = {
  index: number
}

const TimeLayer: React.FC<TimeLayerProps> = React.memo(({ index }) => {
  const diff =
    INTERVALS * INTERVAL_DURATION_HOURS - INTERVAL_DURATION_HOURS * index

  return (
    <WMSTileLayer
      url={NEXRAD_URL}
      opacity={LAYER_OPACITY}
      params={{
        layers: NEXRAD_LAYER + getSuffix(diff),
        format: 'image/png',
        transparent: true,
      }}
    />
  )
})

TimeLayer.displayName = 'TimeLayer'

const MapboxLayer: React.FC<Leaflet.MapboxGLOptions> = React.memo((props) => {
  const map = useMap()
  const layer = Leaflet.mapboxGL(props)

  layer.addTo(map)

  return null
})

MapboxLayer.displayName = 'MapboxLayer'

const layers = new Array(INTERVALS).fill(null).map((_, i) => {
  return <TimeLayer index={i} key={i} />
})

const Map = React.memo(({ pos }: { pos: LatLngTuple }) => {
  return (
    <MapContainer center={pos} zoom={ZOOM} zoomControl={false}>
      <MapboxLayer style={MAPBOX_STYLE} accessToken={MAPBOX_TOKEN} />
      {/* {layers[timeLayerIndex]} */}
      <Marker position={pos} />
    </MapContainer>
  )
})

Map.displayName = 'Map'

const Radar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const activeLocation = useActiveLocation()
  const pos = [activeLocation?.lat, activeLocation?.lng] as LatLngTuple
  // const [timeLayerIndex, setTimeLayerIndex] = useState(0)

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setTimeLayerIndex((i) => {
  //       if (i === INTERVALS - 1) {
  //         return 0
  //       }

  //       return i + 1
  //     })
  //   }, 1000)

  //   return () => {
  //     clearInterval(timer)
  //   }
  // }, [])

  return (
    <Tile
      title="Radar"
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
    >
      <Container>
        <Map pos={pos} />
      </Container>
    </Tile>
  )
}

export default React.memo(Radar)
// export default Radar
