import { Fragment } from 'react'

export default function BreakWord({
  children,
}: {
  children: string
}): JSX.Element | null {
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
