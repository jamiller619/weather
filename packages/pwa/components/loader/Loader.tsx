import { Fragment } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'

import { Flex } from '~/components/layout'
import { State, useStore } from '~/store'

const selector = (state: State) => state.isFetching

const LoaderContainer = styled(Flex)<{ isLoading: boolean }>`
  pointer-events: none;
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  transition: opacity 0.2s ease-in-out;

  opacity: ${({ isLoading }) => (isLoading ? 1 : 0)};
`

export default function Loader(): JSX.Element | null {
  const isFetching = useStore(selector)

  return createPortal(
    <LoaderContainer isLoading={isFetching}>
      {isFetching && <Fragment>Loading...</Fragment>}
    </LoaderContainer>,
    document.body
  )
}
