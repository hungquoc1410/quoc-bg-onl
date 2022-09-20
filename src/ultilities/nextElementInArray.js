export const nextElementInArray = (value, array) => {
  const index = array.indexOf(value)
  if (index >= 0 && index < array.length - 1) {
    return array[index + 1]
  } else {
    return array[0]
  }
}
