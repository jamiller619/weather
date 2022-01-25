import StoreProvider from 'components/providers/StoreProvider'
import StyleProvider from 'components/providers/StyleProvider'
import Home from 'components/routes/Home'
import Settings from 'components/routes/Settings'
import { BrowserRouter } from 'react-router-dom'

export default function App(): JSX.Element {
  return (
    <BrowserRouter>
      <StoreProvider>
        <StyleProvider>
          <Settings />
          <Home />
        </StyleProvider>
      </StoreProvider>
    </BrowserRouter>
  )
}
