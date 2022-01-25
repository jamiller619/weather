import Carousel from 'components/carousel/Carousel'
import {
  Flex,
  FlexDirection,
  FlexDistribute,
  FlexPosition,
  pageStyle,
} from 'components/layout'
import * as Tiles from 'components/tiles'
import { Headline, LargeText, Text } from 'components/typography'
import { HTMLAttributes } from 'react'
import { useLocation } from 'react-router-dom'
import { useActiveLocation, useUserTempFormat } from 'store'
import useWeather from 'store/useWeather'
import styled, { css } from 'styled-components'
import formatLocation from 'utils/formatLocation'

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

const CurrentWeather = styled(Section)`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 2rem;
`

const CarouselContainer = styled(Section)`
  /* position: relative; */
  padding-left: 0;
  height: 50vh;
`

const HeaderContainer = styled(Section).attrs({
  as: 'header',
})`
  flex: 2;
  padding-top: 7rem;
`

const Header: React.FC<HTMLAttributes<HTMLElement>> = (props) => {
  const { location } = useWeather()
  const activeLocation = useActiveLocation(location)

  const today = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date())

  return (
    <HeaderContainer {...props}>
      <Text>{today}</Text>
      <Text>{formatLocation(activeLocation)}</Text>
    </HeaderContainer>
  )
}

export default function Home(): JSX.Element {
  const { current } = useWeather()
  const { temp, high, low } = current
  const formatTemp = useUserTempFormat()
  const location = useLocation()

  return (
    <Container show={location.pathname !== '/settings'}>
      <Header />
      <CurrentWeather>
        <CurrentTemp>{formatTemp(temp)}</CurrentTemp>
        <Flex align={FlexPosition.baseline}>
          <LargeText mono>{formatTemp(high)}</LargeText>
          <Text mono>/&nbsp;</Text>
          <Text mono>{formatTemp(low)}</Text>
        </Flex>
      </CurrentWeather>
      <CarouselContainer>
        <Carousel>
          <Tiles.Hourly />
          <Tiles.Daily />
          <Tiles.Radar />
        </Carousel>
      </CarouselContainer>
    </Container>
  )
}
