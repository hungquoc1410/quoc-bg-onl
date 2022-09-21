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

export const BlankSlatePlayer = async (roomId, playerId, name, color, master = false) => {
  const playerData = {
    id: playerId,
    points: 0,
    answer: '',
    name: name || generateName(),
    color: color || generateColor(),
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
  const allCounted = !playersData.map((player) => player.phase === 'ready').includes(false)
  if (allCounted) {
    return await updateRoom(roomData.id, { phase: 'win' })
  }
  const allAnswers = playersData.map((player) => player.answer)
  const info = await getInfo()
  const { playerId } = info
  const playerData = playersData.filter((player) => player.id === playerId)[0]
  const playerAnswer = playerData.answer
  let updatePoints = playerData.points
  if (playerAnswer && playerData.phase != 'ready') {
    const result = allAnswers.filter((answer) => answer === playerAnswer).length
    if (result === 2) {
      updatePoints = playerData.points + 3
    } else if (result > 2) {
      updatePoints = playerData.points + 1
    }
  }
  return await updatePlayer(roomData.id, playerId, { phase: 'ready', points: updatePoints })
}

export const BlankSlateWin = async (roomData) => {
  const playersData = createArrayFromObject(roomData.players)
  const allPoints = playersData.map((player) => player.points)
  const maxPoint = Math.max(...allPoints)
  if (maxPoint < 25) {
    await updateRoom(roomData.id, { phase: 'waiting' })
    return null
  } else {
    return maxPoint
  }
}

export const BlankSlateReset = async (roomData) => {
  await updateRoom(roomData.id, {
    words: wordsData,
    current: '',
    round: 0,
    numOfPlayers: 1,
  })
  const playersData = createArrayFromObject(roomData.players)
  const allIds = playersData.map((player) => player.id)
  return allIds.forEach((id) => updatePlayer(roomData.id, id, { points: 0, answer: '' }))
}
