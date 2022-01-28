import Location, { createLocation } from '@weather/base/models/Location'

const cityType = 'locality'
const regionType = 'administrative_area_level_1'

const gapi = () => {
  if (globalThis.google?.maps == null) {
    throw new Error(
      `The Google Maps API was unable to load because "google.maps" wasn't found in the global scope. Fix me!`
    )
  }

  return google.maps
}

const parseAddressComponents = (
  data: google.maps.GeocoderAddressComponent[]
): Pick<Location, 'city' | 'region'> => {
  const city = data.find(({ types }) => types.includes(cityType))
  const region = data.find(({ types }) => types.includes(regionType))

  return {
    city: city?.short_name ?? city?.long_name ?? null,
    region: region?.short_name ?? region?.long_name ?? null,
  }
}

export default function geocode(googlePlaceId: string): Promise<Location> {
  const geocoder = new (gapi().Geocoder)()

  return new Promise((resolve, reject) => {
    geocoder.geocode({ placeId: googlePlaceId }, (results, status) => {
      if (status === gapi().GeocoderStatus.OK && results != null) {
        const [result] = results

        const data = {
          lat: result.geometry.location.lat(),
          lng: result.geometry.location.lng(),
          ...parseAddressComponents(results[0].address_components),
        }

        resolve(createLocation('lookup', data))
      } else {
        const msg = `Unable to geocode placeId: ${googlePlaceId}`

        console.error(msg, status)

        reject(msg)
      }
    })
  })
}
