import Location from '@weather/base/models/Location'

export default function formatLocation({ city, region } = {} as Location) {
  return [city, region].filter(Boolean).join(', ')
}
