import localforage from 'localforage'

export async function getInfo() {
  let info = await localforage.getItem('info')
  if (!info) info = {}
  return info
}

export async function setInfo(obj) {
  let info = await getInfo()
  Object.keys(obj).forEach((key) => {
    info[key] = obj[key]
  })
  await set(info)
  return info
}

export async function clearInfo() {
  let info = await getInfo()
  delete info['roomId']
  delete info['gameId']
  await set(info)
  return info
}

function set(info) {
  return localforage.setItem('info', info)
}
