export default function findClosestDate(date: Date, datesList: Date[]) {
  const sorted = datesList.sort((a, b) => a.getTime() - b.getTime())
  const before = sorted.filter((d) => d < date)
  const after = sorted.filter((d) => d > date)

  return before.length > 0 ? before[before.length - 1] : after[0]
}
