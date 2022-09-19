import { generateColor } from '../../../ultilities/colors'
import { createArrayFromObject } from '../../../ultilities/createArrayFromObject'
import { createPlayer, createRoom, updatePlayer, updateRoom } from '../../../ultilities/firebase'
import generateName from '../../../ultilities/generateName'
import { getInfo } from '../../../ultilities/info'

import { wordsData } from './words'

export const BlankSlateRoom = async (roomId, gameId) => {
  const roomData = {
    id: roomId,
    game: gameId,
    minPlayer: 3,
    maxPlayer: 8,
    words: wordsData,
    current: '',
    round: 0,
    numOfPlayers: 1,
    phase: 'waiting',
  }
  return await createRoom(roomId, roomData)
}

export const BlankSlatePlayer = async (roomId, playerId, master = false) => {
  const playerData = {
    id: playerId,
    points: 0,
    answer: '',
    name: generateName(),
    color: generateColor(),
    master,
    phase: 'waiting',
  }
  return await createPlayer(roomId, playerId, playerData)
}

export const BlankSlatePlaying = async (roomData) => {
  const words = roomData.words
  const randomIndex = Math.floor(Math.random() * words.length)
  const current = words.splice(randomIndex, 1)
  await updateRoom(roomData.id, {
    phase: 'answer',
    current: current[0],
    words: words,
    round: roomData.round + 1,
  })
  return current
}

export const BlankSlateAnswer = async (roomData) => {
  const playersData = createArrayFromObject(roomData.players)
  const allAnswered = !playersData.map((player) => player.phase === 'answered').includes(false)
  if (allAnswered) {
    return await updateRoom(roomData.id, { phase: 'points' })
  }
  return null
}

export const BlankPlayerPoints = async (roomData) => {
  const playersData = createArrayFromObject(roomData.players)
  const allCounted = !playersData.map((player) => player.phase === 'counted').includes(false)
  if (allCounted) {
    return await updateRoom(roomData.id, { phase: 'count' })
  }
  const allAnswers = playersData.map((player) => player.answer)
  const info = await getInfo()
  const { playerId } = info
  const playerData = playersData.filter((player) => player.id === playerId)[0]
  const playerAnswer = playerData.answer
  let updatePoints = playerData.points
  if (playerAnswer && playerData.phase != 'counted') {
    const result = allAnswers.filter((answer) => answer === playerAnswer).length
    if (result === 2) {
      updatePoints = playerData.points + 3
    } else if (result > 2) {
      updatePoints = playerData.points + 1
    }
  }
  return await updatePlayer(roomData.id, playerId, { phase: 'counted', points: updatePoints })
}

export const BlankPlayerCount = async (roomData) => {
  const playersData = createArrayFromObject(roomData.players)
  const allNamePoints = playersData.map((player) => {
    return { key: player.id, name: player.name, points: player.points }
  })
  const allPoints = playersData.map((player) => player.points)
  const maxPoint = Math.max(...allPoints)
  const winnerNames = playersData
    .filter((player) => player.points === maxPoint)
    .map((player) => player.name)
  const result = { data: allNamePoints, name: winnerNames, gameId: 'blankslate' }
  if (maxPoint >= 25) {
    await BlankSlateReset(roomData)
    return result
  }
  return null
}

export const BlankSlateReset = async (roomData) => {
  await updateRoom(roomData.id, {
    words: wordsData,
    current: '',
    round: 0,
    numOfPlayers: 1,
    phase: 'waiting',
  })
  const playersData = createArrayFromObject(roomData.players)
  const allIds = playersData.map((player) => player.id)
  return allIds.forEach((id) =>
    updatePlayer(roomData.id, id, { points: 0, phase: 'waiting', answer: '' }),
  )
}
