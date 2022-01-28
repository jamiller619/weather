import Flex, { FlexDirection } from 'components/layout/Flex'
import Text from 'components/typography/Text'
import { HTMLAttributes, PropsWithChildren, useState } from 'react'
import styled from 'styled-components'
import Backdrop from './Backdrop'

const Container = styled(Flex).attrs({
  dir: FlexDirection.column,
})`
  position: absolute;
  inset: 0;

  padding: 1rem;
  height: calc(100% - 2rem);
  width: calc(100% - 2rem);
`

const Title = styled(Text)`
  padding: 2rem;
`

const Content = styled(Flex)`
  flex-grow: 1;

  > * {
    flex: 1;
  }
`

type TileProps = PropsWithChildren<
  Omit<HTMLAttributes<HTMLDivElement>, 'dir'>
> & {
  title: string
  onOpen?: () => void
  onClose?: () => void
}

export default function Tile({
  children,
  title,
  onOpen,
  onClose,
  ...props
}: TileProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false)
  const handleClick = () => {
    setIsOpen((prev) => !prev)

    if (isOpen === true) {
      onClose?.()
    } else {
      onOpen?.()
    }
  }

  return (
    <Container {...props} onClick={handleClick}>
      <Backdrop open={isOpen} />
      <Title>{title}</Title>
      <Content>{children}</Content>
    </Container>
  )
}
