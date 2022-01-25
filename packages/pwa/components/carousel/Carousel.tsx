import { useDrag } from '@use-gesture/react'
import clamp from 'lodash.clamp'
import { Children, HTMLAttributes, PropsWithChildren, useRef } from 'react'
import { animated, useSprings } from 'react-spring'
import styled from 'styled-components'

export type CarouselProps = PropsWithChildren<
  HTMLAttributes<HTMLDivElement>
> & {
  disabled?: boolean
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
    ({ active, movement: [mx], direction: [xDir], cancel }) => {
      if (active && Math.abs(mx) > width / 4) {
        index.current = clamp(
          index.current + (xDir > 0 ? -1 : 1),
          0,
          items.length - 1
        )
        cancel()
      }

      api.start((i) => {
        if (i < index.current - 1 || i > index.current + 1) {
          return {}
        }

        const x = (i - index.current) * width + (active ? mx : 0)
        const scale = active ? 1 - Math.abs(mx) / width / 2 : 1

        return {
          x,
          scale,
        }
      })
    }
  )

  return (
    <Container {...props}>
      {springs.map(({ x, scale }, i) => {
        return (
          <animated.div {...(disabled ? {} : bind())} key={i} style={{ x }}>
            <AnimatedTile style={{ scale }}>{items[i]}</AnimatedTile>
          </animated.div>
        )
      })}
    </Container>
  )
}
