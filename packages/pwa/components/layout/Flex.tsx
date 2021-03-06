import { HTMLAttributes, PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

export enum FlexDirection {
  row = 'row',
  column = 'column',
}

export enum FlexDistribute {
  spaceBetween = 'space-between',
  spaceAround = 'space-around',
  spaceEvenly = 'space-evenly',
  stretch = 'stretch',
}

export enum FlexPosition {
  start = 'flex-start',
  end = 'flex-end',
  center = 'center',
  flexStart = 'flex-start',
  flexEnd = 'flex-end',
  baseline = 'baseline',
}

export type FlexProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>> & {
  dir?: FlexDirection
  justify?: FlexPosition | FlexDistribute
  align?: FlexPosition
}

const Container: React.FC<FlexProps> = ({
  /* eslint-disable @typescript-eslint/no-unused-vars */
  dir,
  justify,
  align,
  //@ts-ignore - unused prop
  show,
  //@ts-ignore - unused prop
  isLoading,
  /* eslint-enable @typescript-eslint/no-unused-vars */
  children,
  ...props
}) => {
  return <div {...props}>{children}</div>
}

const Flex = styled(Container)`
  display: flex;
  ${(props) =>
    props.dir &&
    css`
      flex-direction: ${props.dir};
    `};
  ${(props) =>
    props.justify &&
    css`
      justify-content: ${props.justify};
    `};
  ${(props) =>
    props.align &&
    css`
      align-items: ${props.align};
    `};
`

export default Flex

export const FlexItem = styled.div`
  flex: 1 1 0;
`
