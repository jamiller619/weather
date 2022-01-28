import { Fragment } from 'react'

type BreakWordProps = {
  children: string
}

export default function BreakWord({
  children,
}: BreakWordProps): JSX.Element | null {
  if (
    children == null ||
    (typeof children === 'string' && children.trim() === '')
  ) {
    return null
  }

  const words = children.trim().split(' ')

  return (
    <Fragment>
      {words.map((word, i) => {
        return (
          <Fragment key={i}>
            {word} {i < words.length - 1 && <br />}
          </Fragment>
        )
      })}
    </Fragment>
  )
}
