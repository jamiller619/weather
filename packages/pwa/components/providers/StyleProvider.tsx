import { Fragment, ReactNode } from 'react'
import WeatherIcons from 'style/fonts/WeatherIcons.woff'
import { darkTheme } from 'style/theme'
import {
  createGlobalStyle,
  StyleSheetManager,
  ThemeProvider,
} from 'styled-components'
import reset from 'styled-reset'

const GlobalStyle = createGlobalStyle`
  ${reset}

  @font-face {
    font-family: 'weather-icons', sans-serif;
    src: url(${WeatherIcons}) format('woff');
  }

  body {
    background-color: #23232e;
    color: ${({ theme }) => theme.colors.foreground};
    font-family: 'DM Sans', sans-serif;
    font-size: 16px;
    font-weight: 300;
    -webkit-font-smoothing: antialiased;
  }
`

export default function StyleProvider({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  return (
    <ThemeProvider theme={darkTheme}>
      <StyleSheetManager disableVendorPrefixes>
        <Fragment>
          <GlobalStyle />
          {children}
        </Fragment>
      </StyleSheetManager>
    </ThemeProvider>
  )
}
