export const encrypt = () => {
  const array = new Uint8Array(5)
  crypto.getRandomValues(array)

  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}