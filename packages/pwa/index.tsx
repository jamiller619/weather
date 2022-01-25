import App from 'components/App'
import { StrictMode } from 'react'
import { render } from 'react-dom'

render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)
