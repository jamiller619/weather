import Location, { createLocation } from '@weather/base/models/Location'
import { ChangeEvent, Fragment } from 'react'
import useOnClickOutside from 'react-cool-onclickoutside'
import styled from 'styled-components'
import usePlacesAutocomplete from 'use-places-autocomplete'
import { Textbox } from '~/components/input'
import { List, ListItem, MutedText, StrongText } from '~/components/typography'
import useGAPI from '~/hooks/useGAPI'
import useIsMounted from '~/hooks/useIsMounted'
import geocode from '~/location/geocode'

const Headline = styled(StrongText)`
  display: inline;
  margin-right: 0.5rem;
`

const SubHeadline = styled(MutedText)`
  font-size: small;
  display: inline;
`

const AutocompleteList = styled(List)`
  position: absolute;
  width: 80vw;
  border: 3px solid ${({ theme }) => theme.colors.foreground};
  border-top: none;

  text-align: left;
  overflow-y: auto;
  background-color: ${({ theme }) => theme.colors.background};
  box-sizing: border-box;
  z-index: 1;
`

const AutocompleteListItem = styled(ListItem)`
  display: block;
  padding: 1rem 1.2rem;
  cursor: pointer;
`

export type LocationAutocompleteProps = {
  onSelect: (location: Location) => void
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  onSelect,
}) => {
  const isMounted = useIsMounted()
  const {
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    debounce: 300,
  })

  const ref = useOnClickOutside(() => void resetInputState())

  const resetInputState = (value = '', shouldFetchData = true) => {
    clearSuggestions()

    // When user selects a place, we can replace the keyword without request data from API
    // by setting the second parameter to "false"
    setValue(value, shouldFetchData)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e?.target?.value ?? '')
  }

  const handleSelect = (
    suggestion: google.maps.places.AutocompletePrediction
  ) => {
    return async () => {
      const coords = await geocode(suggestion.place_id)

      if (isMounted()) {
        const location = createLocation('lookup', coords)

        onSelect(location)

        resetInputState()
      }
    }
  }

  return (
    <Fragment>
      <Textbox value={value} onChange={handleChange}></Textbox>
      {status === 'OK' && (
        <AutocompleteList ref={ref}>
          {data.map((suggestion) => {
            const {
              place_id,
              structured_formatting: { main_text, secondary_text },
            } = suggestion

            return (
              <AutocompleteListItem
                key={place_id}
                onClick={handleSelect(suggestion)}
              >
                <Headline>{main_text}</Headline>
                <SubHeadline>{secondary_text}</SubHeadline>
              </AutocompleteListItem>
            )
          })}
        </AutocompleteList>
      )}
    </Fragment>
  )
}

export default function LocationAutocompleteContainer(
  props: LocationAutocompleteProps
): JSX.Element | null {
  const isGAPILoaded = useGAPI()

  return isGAPILoaded ? <LocationAutocomplete {...props} /> : null
}
