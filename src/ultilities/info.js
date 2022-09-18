import localforage from 'localforage'

export const getInfo = async () => {
  let info = await localforage.getItem('info')
  if (!info) info = {}
  return info
}

export const setInfo = async (obj) => {
  let info = await getInfo()
  Object.keys(obj).forEach((key) => {
    info[key] = obj[key]
  })
  await set(info)
  return info
}

export const clearInfo = async () => {
  let info = await getInfo()
  delete info['roomId']
  delete info['gameId']
  await set(info)
  return info
}

const set = (info) => {
  return localforage.setItem('info', info)
}
