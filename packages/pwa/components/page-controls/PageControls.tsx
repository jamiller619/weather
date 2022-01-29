import styled from 'styled-components'
import { Flex, FlexDirection, FlexPosition } from '~/components/layout'

type Dir = 'horizontal' | 'vertical'

type PageControlProps = {
  length: number
  current: number
  dir?: Dir
}

const Container = styled(Flex).attrs({
  align: FlexPosition.center,
  justify: FlexPosition.center,
})`
  width: 100%;
`

const Dot = styled.div<{ active: boolean }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 100%;
  margin: 0.33rem;
  background: ${({ active, theme }) =>
    active ? theme.colors.foreground : theme.colors.faded};
`

export default function PageControls({
  length,
  current,
  dir = 'horizontal',
}: PageControlProps): JSX.Element {
  return (
    <Container
      dir={dir === 'horizontal' ? FlexDirection.row : FlexDirection.column}
    >
      {new Array(length).fill(null).map((_, index) => {
        return <Dot active={index === current} key={index} />
      })}
    </Container>
  )
}
