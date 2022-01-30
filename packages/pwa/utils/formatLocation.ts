import { LocationMeta } from '@weather/base/models/Location'

export default function formatLocation(
  city?: string | LocationMeta,
  region?: string
): string {
  if (typeof city === 'string') {
    return [city, region].filter(Boolean).join(', ')
  } else if (city?.city != null) {
    return formatLocation(city.city, city?.region)
  }

  return ''
}
