import { Forecast } from '@weather/base/models/Weather'
import WeatherIcon from 'components/icons/WeatherIcon'
import { Flex, FlexDirection, FlexDistribute } from 'components/layout'
import { BreakWord, LargeText } from 'components/typography'
import { useUserTempFormat } from 'store'
import styled from 'styled-components'

const ColumnContainer = styled(Flex).attrs({
  dir: FlexDirection.column,
  justify: FlexDistribute.spaceAround,
})`
  text-align: center;
  height: 90%;
`

const Title = styled.div`
  height: 2rem;
`

type ColumnProps = {
  title: string
  forecast: Forecast
}

export default function Column({ title, forecast }: ColumnProps) {
  const formatTemp = useUserTempFormat()

  return (
    <ColumnContainer>
      <Title>
        <BreakWord>{title}</BreakWord>
      </Title>
      <WeatherIcon
        forecast={forecast.shortDescription}
        isDay={forecast.isDay}
      />
      <LargeText>{formatTemp(forecast.temp)}</LargeText>
    </ColumnContainer>
  )
}
