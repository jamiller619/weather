import {
  Fragment,
  HTMLAttributes,
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { useLocation } from 'react-router-dom'
import styled, { css } from 'styled-components'

import { LocationMeta } from '@weather/base/models/Location'
import { CurrentWeather } from '@weather/base/models/Weather'

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
  location?: LocationMeta
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
      <Text>{formatLocation(location)}</Text>
    </HeaderContainer>
  )
}

const WeatherHeadlines: React.FC<
  Pick<CurrentWeather, 'temp' | 'high' | 'low'>
> = memo(({ temp, high, low }): JSX.Element => {
  const formatTemp = useUserTempFormat()

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
})

WeatherHeadlines.displayName = 'WeatherHeadlines'

const LocationCarouselContainer = styled(Carousel)`
  flex: 2;
`

const InnerLocationCarouselContainer = styled(Flex).attrs({
  dir: FlexDirection.column,
})`
  height: 100%;
`

const selector = (state: State) => ({
  locations: Object.values(state.user.locations),
  weather: Object.entries(state.weather.data),
  setActiveLocation: state.user.setActiveLocation,
  activeLocationId: state.user.activeLocationId,
})

const LocationCarousel: React.FC = () => {
  const { locations, setActiveLocation, activeLocationId, weather } =
    useStore(selector)

  const activeLocationIndex = useMemo(
    () => locations.findIndex(({ id }) => id === activeLocationId),
    [activeLocationId, locations]
  )

  const activeWeather = useMemo(
    () =>
      weather.find(([id]) => id === activeLocationId)?.[1].current ??
      ({} as CurrentWeather),
    [activeLocationId, weather]
  )

  const handleCarouselChange = useCallback(
    (index: number) => {
      const { id } = locations[index]

      setActiveLocation(id)
    },
    [locations, setActiveLocation]
  )

  return (
    <Fragment>
      <LocationCarouselContainer onChange={handleCarouselChange}>
        {locations.map((location) => (
          <InnerLocationCarouselContainer key={location.id}>
            <Header location={location} />
            <WeatherHeadlines
              temp={activeWeather.temp}
              low={activeWeather.low}
              high={activeWeather.high}
            />
          </InnerLocationCarouselContainer>
        ))}
      </LocationCarouselContainer>
      {locations.length > 1 && (
        <PageControls length={locations.length} current={activeLocationIndex} />
      )}
    </Fragment>
  )
}

const WeatherCarouselContainer = styled(Section)`
  padding-left: 0;
  height: 50vh;
  margin-bottom: 2rem;
`

const WeatherCarousel: React.FC = () => {
  const [activeCarouselPage, setActiveCarouselPage] = useState(0)

  return (
    <WeatherCarouselContainer>
      <Carousel onChange={setActiveCarouselPage}>
        <Tiles.Hourly />
        <Tiles.Daily />
        <Tiles.Radar />
      </Carousel>
      <PageControls length={3} current={activeCarouselPage} />
    </WeatherCarouselContainer>
  )
}

export default function Home(): JSX.Element {
  const { pathname } = useLocation()

  return (
    <Fragment>
      <Backdrop />
      <Container show={pathname === '/'}>
        <LocationCarousel />
        <WeatherCarousel />
      </Container>
    </Fragment>
  )
}
