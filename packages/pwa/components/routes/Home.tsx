import Location from '@weather/base/models/Location'
import { Fragment, HTMLAttributes, useCallback, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'
import shallow from 'zustand/shallow'
import Backdrop from '~/components/backdrop/Backdrop'
import Carousel from '~/components/carousel/Carousel'
import {
  Flex,
  FlexDirection,
  FlexDistribute,
  FlexPosition,
  pageStyle,
} from '~/components/layout'
import PageControls from '~/components/page-controls/PageControls'
import * as Tiles from '~/components/tiles'
import { Headline, LargeText, Text } from '~/components/typography'
import { State, useStore, useUserTempFormat } from '~/store'
import formatLocation from '~/utils/formatLocation'

const Container = styled(Flex).attrs({
  dir: FlexDirection.column,
  justify: FlexDistribute.spaceBetween,
})<{ show: boolean }>`
  ${pageStyle}
  height: 100vh;

  ${({ show }) =>
    show
      ? css`
          transform: none;
        `
      : css`
          transform: scale(0.9) translate(10vw);
        `}
`

const CurrentTemp = styled(Headline)`
  font-family: ${({ theme }) => theme.fonts.mono};
  letter-spacing: -0.05em;
`

const Section = styled.div`
  padding-left: 2rem;

  ${CurrentTemp} {
    margin-left: -0.25rem;
  }
`

const WeatherHeadlinesContainer = styled(Section)`
  padding-bottom: 2rem;
`

const WeatherCarousel = styled(Section)`
  padding-left: 0;
  height: 50vh;
  margin-bottom: 2rem;
`

const HeaderContainer = styled(Section).attrs({
  as: 'header',
})`
  flex: 2;
  padding-top: 7rem;
  padding-left: 2.5rem;
`

const CurrentWeatherDetails = styled(Flex).attrs({
  align: FlexPosition.baseline,
})`
  padding-left: 0.5rem;
`

type HeaderProps = HTMLAttributes<HTMLElement> & {
  location?: Location | null
}

const Header: React.FC<HeaderProps> = ({ location, ...props }) => {
  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date())

  return (
    <HeaderContainer {...props}>
      <Text>{today}</Text>
      <Text>{location != null && formatLocation(location)}</Text>
    </HeaderContainer>
  )
}

const LocationCarouselContainer = styled(Carousel)`
  flex: 2;
`

const InnerLocationCarouselContainer = styled(Flex).attrs({
  dir: FlexDirection.column,
})`
  height: 100%;
`

const weatherHeadlinesSelector = (state: State) =>
  state.weather.getCurrentWeatherForLocation

const WeatherHeadlines: React.FC<{ locationId: string }> = ({
  locationId,
}): JSX.Element => {
  const formatTemp = useUserTempFormat()
  const getWeather = useStore(weatherHeadlinesSelector)
  const { temp, high, low } = useMemo(
    () => getWeather(locationId),
    [getWeather, locationId]
  )
  // const [currentTempRef, resetCurrentTemp] = useSkeleton('9rem', '6rem')
  // const [highTempRef, resetHighTemp] = useSkeleton('4rem', '3rem')
  // const [lowTempRef, resetLowTemp] = useSkeleton('4rem', '3rem')

  // useEffect(() => {
  //   if (temp != null && high != null && low != null) {
  //     resetCurrentTemp()
  //     resetHighTemp()
  //     resetLowTemp()
  //   }
  // }, [high, low, resetCurrentTemp, resetHighTemp, resetLowTemp, temp])

  return (
    <WeatherHeadlinesContainer>
      <CurrentTemp>{formatTemp(temp)}</CurrentTemp>
      <CurrentWeatherDetails>
        <LargeText mono>{formatTemp(high)}</LargeText>
        <Text mono>/&nbsp;</Text>
        <Text mono>{formatTemp(low)}</Text>
      </CurrentWeatherDetails>
    </WeatherHeadlinesContainer>
  )
}

const selector = (state: State) => ({
  activeLocationId: state.user.activeLocationId,
  setActiveLocation: state.user.setActiveLocation,
  locations: state.user.locations,
})

const LocationCarousel: React.FC = () => {
  // const { current } = useWeather()
  // const { temp, high, low } = current

  const {
    activeLocationId,
    setActiveLocation,
    locations: locationsObject,
  } = useStore(selector, shallow)

  const locations = useMemo(
    () => Object.values(locationsObject),
    [locationsObject]
  )

  const activeLocationIndex = useMemo(
    () => locations.findIndex(({ id }) => id === activeLocationId),
    [activeLocationId, locations]
  )

  // const startIndex = useRef(activeLocationIndex)
  const handleCarouselChange = useCallback(
    (index: number) => {
      return setActiveLocation(locations[index].id)
    },
    [locations, setActiveLocation]
  )

  return (
    <Fragment>
      <LocationCarouselContainer onChange={handleCarouselChange}>
        {locations.map((location) => (
          <InnerLocationCarouselContainer key={location.id}>
            <Header location={location} />
            <WeatherHeadlines locationId={location.id} />
          </InnerLocationCarouselContainer>
        ))}
      </LocationCarouselContainer>
      <PageControls length={locations.length} current={activeLocationIndex} />
    </Fragment>
  )
}

export default function Home(): JSX.Element {
  const { pathname } = useLocation()
  const [activeCarouselPage, setActiveCarouselPage] = useState(0)

  return (
    <Fragment>
      <Backdrop />
      <Container show={pathname === '/'}>
        <LocationCarousel />
        <WeatherCarousel>
          <Carousel onChange={setActiveCarouselPage}>
            <Tiles.Hourly />
            <Tiles.Daily />
            <Tiles.Radar />
          </Carousel>
          <PageControls length={3} current={activeCarouselPage} />
        </WeatherCarousel>
      </Container>
    </Fragment>
  )
}
