import useSize from '@react-hook/size'
import clamp from 'lodash.clamp'
import { SVGAttributes, useMemo, useRef } from 'react'
import { animated, useSpring } from 'react-spring'
import styled from 'styled-components'

const Container = styled.div`
  /* Using position: fixed here introduces a bug when
  flipping through the carousel. */
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
  z-index: -1;
`

const SVGContainer = styled.svg`
  width: 100vw;
  height: 100%;
  overflow: visible;
  rect {
    transform-origin: 50% calc(100% - 1rem);
    filter: drop-shadow(0px 0px 5px rgba(0 0 0 / 0.33));
    fill: rgba(0, 0, 0, 0.3);
  }
`

type BackdropProps = SVGAttributes<SVGSVGElement> & {
  open: boolean
}

export default function Backdrop({
  open,
  ...props
}: BackdropProps): JSX.Element {
  const ref = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [_, contentHeight] = useSize(ref)
  const ws = useMemo(() => {
    return {
      height: window.innerHeight,
      width: window.innerWidth,
    }
  }, [])

  const padding = 16

  const closedDims = {
    x: padding,
    y: padding / 2,
    width: ws.width - padding * 2,
    height: contentHeight - padding,
  }

  const openDims = {
    x: padding / 2,
    y: -(ws.height / 2) - padding * 1.5,
    width: ws.width - padding,
    height: ws.height - padding,
  }

  const config = {
    mass: 0.1,
    tension: 300,
    friction: 20,
  }

  const parsed = open ? openDims : closedDims
  const dimensions = useSpring({
    ...parsed,
    height: clamp(parsed.height, 0, ws.height),
    config,
  })

  return (
    <Container ref={ref}>
      <SVGContainer ref={svgRef} {...props}>
        <animated.rect rx="1rem" {...dimensions} />
      </SVGContainer>
    </Container>
  )
}
