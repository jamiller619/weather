import { BrowserRouter } from 'react-router-dom'

import Loader from '~/components/loader/Loader'
import StoreProvider from '~/components/providers/StoreProvider'
import StyleProvider from '~/components/providers/StyleProvider'
import Home from '~/components/routes/Home'
import Settings from '~/components/routes/Settings'

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <StoreProvider>
        <StyleProvider>
          <Loader />
          <Settings />
          <Home />
        </StyleProvider>
      </StoreProvider>
    </BrowserRouter>
  )
}
