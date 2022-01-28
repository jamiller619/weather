import { useDrag } from '@use-gesture/react'
import clamp from 'lodash.clamp'
import { Children, HTMLAttributes, PropsWithChildren, useRef } from 'react'
import { animated, useSprings } from 'react-spring'
import styled from 'styled-components'

export type CarouselProps = PropsWithChildren<
  Omit<HTMLAttributes<HTMLDivElement>, 'onChange'>
> & {
  disabled?: boolean
  onChange?: (index: number) => void
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;

  > * {
    touch-action: none;
    height: 100%;
  }
`

const Tile = styled.div`
  width: 100vw;
  height: 100%;
  position: absolute;
  inset: 0;
`

const AnimatedTile = animated(Tile)

export default function Carousel({
  children,
  onChange,
  disabled = false,
  ...props
}: CarouselProps): JSX.Element {
  const index = useRef(0)
  const width = window.innerWidth
  const items = Children.toArray(children)

  const [springs, api] = useSprings(items.length, (i) => ({
    x: i * width,
    scale: 1,
  }))

  const bind = useDrag(
    ({ active, movement: [mx], direction: [dx], cancel }) => {
      const amx = Math.abs(mx)

      if (active && amx > width / 4) {
        const oldIndex = index.current
        const newIndex = clamp(
          oldIndex + (dx > 0 ? -1 : 1),
          0,
          items.length - 1
        )

        if (oldIndex !== newIndex) {
          onChange?.(newIndex)
        }

        index.current = newIndex

        cancel()
      }

      api.start((i) => {
        if (i < index.current - 1 || i > index.current + 1) {
          return {
            display: 'none',
          }
        }

        const x = (i - index.current) * width + (active ? mx : 0)
        const scale = active ? 1 - amx / width / 2 : 1

        return {
          x,
          scale,
          display: 'block',
        }
      })
    }
  )

  return (
    <Container {...props}>
      {springs.map(({ x, scale }, i) => (
        <animated.div {...(disabled ? {} : bind())} key={i} style={{ x }}>
          <AnimatedTile style={{ scale }}>{items[i]}</AnimatedTile>
        </animated.div>
      ))}
    </Container>
  )
}
