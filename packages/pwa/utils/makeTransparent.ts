export default function makeTransparent(color: string, value: number): string {
  const opacity = Math.floor(value * 255).toString(16)

  return `${color}${opacity}`
}
