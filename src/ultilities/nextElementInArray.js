import _ from 'underscore'

export const nextElementInArray = (value, array) => {
  const index = _.indexOf(array, value)
  if (index >= 0 && index < array.length - 1) {
    return array[index + 1]
  } else {
    return array[0]
  }
}
