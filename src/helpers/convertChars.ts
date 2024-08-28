export const convertChars = (str: string) => {
  const chars = { "<": " ", ">": " " }

  return str.replace(/[<>]/g, (s) => {
    return chars[s]
  })
}
