import Location from '@weather/base/models/Location'

export default function formatLocation({ city, region }: Location) {
  return [city, region].filter(Boolean).join(', ')
}
