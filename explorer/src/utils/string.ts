export const shortString = (value: string, initialLength = 6, endLength = -4): string =>
  `${value.slice(0, initialLength)}...${value.slice(endLength)}`

export const camelToNormal = (text: string) => text.replace(/([A-Z])/g, ' $1').trim()

export const capitalizeFirstLetter = (string: string) =>
  string ? string.charAt(0).toUpperCase() + string.slice(1) : ''

export const limitText = (text: string, limit = 20) =>
  text.length > limit ? text.slice(0, limit) + '...' : text
