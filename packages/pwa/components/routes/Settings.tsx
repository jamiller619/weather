import { Switch } from 'components/input'
import LocationAutocomplete from 'components/input/LocationAutocomplete'
import {
  Flex,
  FlexDirection,
  FlexDistribute,
  FlexPosition,
  pageStyle,
} from 'components/layout'
import { List, ListItem } from 'components/typography'
import { ChangeEvent, Fragment, SVGAttributes } from 'react'
import {
  VscChromeClose,
  VscListSelection,
  VscLocation,
  VscTrash,
} from 'react-icons/vsc'
import { useLocation, useNavigate } from 'react-router-dom'
import { State, useStore } from 'store'
import styled, { css, keyframes } from 'styled-components'
import formatLocation from 'utils/formatLocation'
import shallow from 'zustand/shallow'

const Container = styled.div<{ show: boolean }>`
  ${pageStyle}
  overflow: visible;
  width: 85vw;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 3rem 1rem 0 1rem;
  z-index: 1;

  ${({ show }) =>
    show
      ? css`
          box-shadow: 0 0 40px 6px rgb(0 0 0 / 75%);
          transform: translate(0);
        `
      : css`
          box-shadow: none;
          transform: translate(-100vw);
        `}
`

const Form = styled(Flex).attrs({
  dir: FlexDirection.column,
})`
  margin-top: 2rem;
`

const Control = styled(Flex).attrs({
  align: FlexPosition.center,
  justify: FlexDistribute.spaceBetween,
})`
  margin: 1rem 0;
`

const Label = styled.label`
  display: block;
`

const Locations = styled(Flex).attrs({
  dir: FlexDirection.column,
})`
  padding-top: 2rem;
  flex: 1;

  ${Label} {
    margin-bottom: 0.5rem;
  }
`

const LocationList = styled(List)`
  margin-top: 2rem;
`

const LocationListItem = styled(ListItem)`
  align-items: center;
  border-top: 3px solid ${({ theme }) => theme.colors.foreground};
  justify-content: space-between;
  padding: 1rem 0;
  width: 100%;
`

const AddLocation = styled(Control)`
  display: block;
`

const fadeIn = keyframes`
  0% {
    transform: scale(0.6);
    opacity: 0;
  }
  80% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`

const toggleIcon = css`
  position: absolute;
  top: 2rem;
  font-size: 2rem;
  z-index: 2;
  animation: ${fadeIn} 300ms 100ms ease-in-out backwards;
  transform-origin: center;
`

const MenuIcon = styled(VscListSelection)`
  ${toggleIcon}
  right: calc(100% - 4rem);
`

const CloseIcon = styled(VscChromeClose)`
  ${toggleIcon}
  right: 3rem;
`

const icon = css`
  font-size: 1.6em;
`

const DeleteIcon = styled(VscTrash)`
  ${icon}
  fill: ${({ theme }) => theme.colors.faded};
`

const MarkerIcon = styled(VscLocation)`
  ${icon}
  fill: ${({ theme }) => theme.colors.success};
  padding-right: 0.25rem;
`

type SettingsToggleIconProps = SVGAttributes<SVGSVGElement> & { show: boolean }

const SettingsToggleIcon: React.FC<SettingsToggleIconProps> = ({
  show,
  ...props
}) => {
  return show ? <CloseIcon {...props} /> : <MenuIcon {...props} />
}

const selector = (state: State) => state.user

export default function Settings(): JSX.Element {
  const location = useLocation()
  const navigate = useNavigate()
  const isOpen = location.pathname === '/settings'
  const {
    settings,
    locations,
    saveSettings,
    addLocation,
    removeLocation,
    activeLocationId,
  } = useStore(selector, shallow)

  const handleIconToggle = () => {
    if (isOpen) {
      navigate(-1)
    } else {
      navigate('/settings')
    }
  }

  const handleToggleTheme = (e: ChangeEvent<HTMLInputElement>) => {
    saveSettings({ theme: e.target.checked ? 'dark' : 'light' })
  }

  const handleToggleAutoDetectLocation = (e: ChangeEvent<HTMLInputElement>) => {
    saveSettings({ autoDetectCurrentLocation: e.target.checked })
  }

  const handleToggleUnits = (e: ChangeEvent<HTMLInputElement>) => {
    saveSettings({ units: e.target.checked ? 'F' : 'C' })
  }

  const handleDeleteLocation = (locationId: string) => () => {
    removeLocation(locationId)
  }

  return (
    <Fragment>
      <SettingsToggleIcon show={isOpen} onClick={handleIconToggle} />
      <Container show={isOpen}>
        <Form>
          <Control>
            <Label>Dark mode</Label>
            <Switch
              checked={settings.theme === 'dark'}
              onChange={handleToggleTheme}
            />
          </Control>
          <Control>
            <Label>Show temperature in faharenheit</Label>
            <Switch
              checked={settings.units === 'F'}
              onChange={handleToggleUnits}
            />
          </Control>
          <Control>
            <Label>Auto detect current location</Label>
            <Switch
              checked={settings.autoDetectCurrentLocation}
              onChange={handleToggleAutoDetectLocation}
            />
          </Control>
        </Form>
        <Locations>
          <AddLocation>
            <Label>Add a location</Label>
            <LocationAutocomplete onSelect={addLocation} />
          </AddLocation>
          <LocationList>
            <Label>Saved locations</Label>
            {Object.values(locations).map((location) => (
              <LocationListItem key={location.id}>
                <Flex align={FlexPosition.center}>
                  {location.id === activeLocationId && <MarkerIcon />}
                  {formatLocation(location)}
                </Flex>
                {location.id !== activeLocationId && (
                  <DeleteIcon onClick={handleDeleteLocation(location.id)} />
                )}
              </LocationListItem>
            ))}
          </LocationList>
        </Locations>
      </Container>
    </Fragment>
  )
}
