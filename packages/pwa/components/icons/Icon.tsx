import { SVGAttributes } from 'react'
import styled from 'styled-components'

export type IconProps = SVGAttributes<SVGSVGElement> & {
  size?: number
}

const Icon = styled.svg.attrs<IconProps>({
  viewBox: '0 0 24 24',
})<IconProps>`
  width: ${({ size }) => (size == null ? 30 : size)}px;
  height: ${({ size }) => (size == null ? 30 : size)}px;
  fill: currentColor;
`

export default Icon
