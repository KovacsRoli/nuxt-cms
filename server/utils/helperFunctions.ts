export const capitalizeString = (str: string) => {
  if (!str) return ''
  return str
    .split(' ')
    .map((word) => word?.[0]?.toUpperCase() + word.slice(1))
    .filter((val) => val !== 'undefined')
    .join(' ')
}
