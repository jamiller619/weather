import Leaflet, { LatLngTuple } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'mapbox-gl-leaflet'
import 'mapbox-gl/dist/mapbox-gl.css'
import React, { useEffect, useMemo, useState } from 'react'
import {
  Marker,
  MapContainer as RLMapContainer,
  WMSTileLayer,
  useMap,
} from 'react-leaflet'
import styled from 'styled-components'

import { MAPBOX_STYLE, MAPBOX_TOKEN } from '~/config'
import useActiveLocation from '~/store/useActiveLocation'

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

const TimeLayer: React.FC<TimeLayerProps> = ({ index }) => {
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
}

const MapboxLayer: React.FC<Leaflet.MapboxGLOptions> = (props) => {
  const map = useMap()
  const layer = Leaflet.mapboxGL(props)

  layer.addTo(map)

  return null
}

const layers = new Array(INTERVALS).fill(null).map((_, i) => {
  return <TimeLayer index={i} key={i} />
})

const Map = ({ pos }: { pos: LatLngTuple }) => {
  return (
    <MapContainer center={pos} zoom={ZOOM} zoomControl={false}>
      <MapboxLayer style={MAPBOX_STYLE} accessToken={MAPBOX_TOKEN} />
      {/* {layers[timeLayerIndex]} */}
      <Marker position={pos} />
    </MapContainer>
  )
}

const Radar: React.FC = () => {
  const activeLocation = useActiveLocation()
  const [map, setMap] = useState<L.Map | null>(null)

  const displayMap = useMemo(
    () => (
      <MapContainer zoom={ZOOM} zoomControl={false} whenCreated={setMap}>
        <MapboxLayer style={MAPBOX_STYLE} accessToken={MAPBOX_TOKEN} />
        {/* {layers[timeLayerIndex]} */}
        {/* <Marker position={pos} /> */}
      </MapContainer>
    ),
    []
  )

  useEffect(() => {
    const pos = [activeLocation?.lat, activeLocation?.lng] as LatLngTuple
    console.log(map)

    if (map) {
      map.setView(pos, ZOOM)
    }
  }, [activeLocation, map])

  return (
    <Tile title="Radar">
      <Container>{displayMap}</Container>
    </Tile>
  )
}

export default React.memo(Radar)
// export default Radar
