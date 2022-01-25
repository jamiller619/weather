export const toFahrenheit = (v: number) => Math.round(v * 1.8 + 32)
export const toCelcius = (v: number) => Math.round((v - 32) / 1.8)

export const toDegrees = (value: number | undefined, unit: 'C' | 'F') => {
  if (value != null) {
    return `${unit === 'C' ? toCelcius(value) : toFahrenheit(value)}\u00B0`
  }
}
