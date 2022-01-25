import { HTMLAttributes, ReactNode } from 'react'
import styled from 'styled-components'

export type TextProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div'
  inline?: boolean
  mono?: boolean
}

const Wrapper = styled.span<TextProps>`
  display: ${({ inline }) => (inline ? 'initial' : 'block')};
  line-height: 1.33em;
  font-family: ${({ mono, theme }) => (mono ? theme.fonts.mono : 'inherit')};
`

export default function Text(props: TextProps) {
  return <Wrapper {...props} />
}

export const Headline = styled(Text).attrs({
  as: 'h1',
})`
  font-size: 6rem;
`

export const SubHeadline = styled(Text).attrs({
  as: 'h2',
})`
  font-size: 5rem;
`

export const Title = styled(Text)`
  font-size: 3rem;
`

export const LargeText = styled(Text)`
  font-size: 1.5rem;
`

export const SmallText = styled(Text)`
  font-size: small;
  letter-spacing: 0.1rem;
`

export const InlineText = styled(Text)`
  display: inline;
`

export const MutedText = styled(Text)`
  opacity: 0.5;
`

export const StrongText = styled(Text)`
  font-weight: bold;
`

export const EmphasizedText = styled(Text)`
  font-style: italic;
`
