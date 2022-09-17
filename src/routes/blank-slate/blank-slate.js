import { set, update } from 'firebase/database'

import { createArrayFromObject } from '../../ultilities/createArrayFromObject'
import { getPlayerData, getRoomData, setPlayerRef, setRoomRef } from '../../ultilities/firebase'
import generateName from '../../ultilities/generateRandomName'

import { wordsData } from './words'

export async function BlankSlateRoom(roomId, gameId) {
  const roomRef = setRoomRef(roomId)
  const roomData = {
    id: roomId,
    game: gameId,
    playing: false,
    minPlayer: 3,
    maxPlayer: 8,
    words: wordsData,
    current: '',
    round: 0,
    numOfPlayers: 1,
    phase: 'waiting',
  }
  await set(roomRef, roomData)
  return roomData
}

export async function BlankSlatePlayer(roomId, playerId, master = false) {
  const playerRef = setPlayerRef(roomId, playerId)
  const playerData = {
    id: playerId,
    points: 0,
    answer: '',
    ready: false,
    name: generateName(),
    master,
    phase: 'waiting',
  }
  await set(playerRef, playerData)
  return playerData
}

export async function updateBlankSlatePlayer(roomId, playerId, data) {
  const playerDataRef = setPlayerRef(roomId, playerId)
  await update(playerDataRef, data)
  return null
}

export async function updateBlankSlateRoom(roomId, data) {
  const roomDataRef = setRoomRef(roomId)
  await update(roomDataRef, data)
  return null
}

export async function checkMasterBlankSlate(roomId) {
  const roomData = await getRoomData(roomId)
  const playersData = createArrayFromObject(roomData.players)
  const result = playersData.map((player) => player.master).includes(true)
  if (!result) {
    return updateBlankSlatePlayer(roomId, playersData[0].id, { master: true })
  }
  return null
}

export async function checkNumberOfPlayersBlankSlate(roomId) {
  const roomData = await getRoomData(roomId)
  const numOfPlayers = createArrayFromObject(roomData.players).length
  return updateBlankSlateRoom(roomId, { numOfPlayers: numOfPlayers })
}

export function checkBlankSlate(roomId) {
  checkNumberOfPlayersBlankSlate(roomId)
  checkMasterBlankSlate(roomId)
}

export async function setCurrentWord(roomId) {
  const roomData = await getRoomData(roomId)
  const words = roomData.words
  const randomIndex = Math.floor(Math.random() * words.length)
  const current = words.splice(randomIndex, 1)
  await updateBlankSlateRoom(roomId, { phase: 'points', current: current[0], words: words })
  return current
}

export async function setBlankSlatePlayerAnswer(roomId, playerId, value) {
  return updateBlankSlatePlayer(roomId, playerId, {
    phase: 'answered',
    answer: value.toUpperCase(),
  })
}

export async function checkPlayerPoints(roomId) {
  const roomData = await getRoomData(roomId)
  const playersData = createArrayFromObject(roomData.players)
  const allConfirm = playersData
    .map((player) => player.phase)
    .every((phase) => phase === 'answered')
  if (allConfirm) {
    return updateBlankSlateRoom(roomId, { phase: 'count' })
  }
  return null
}

export async function checkPlayerCount(roomId) {
  const roomData = await getRoomData(roomId)
  const playersData = createArrayFromObject(roomData.players)
  const allWaiting = playersData.map((player) => player.phase).every((phase) => phase === 'waiting')
  if (allWaiting) {
    return updateBlankSlateRoom(roomId, { phase: 'waiting' })
  }
  return null
}

export async function setBlankSlatePlayerPoint(roomId, playerId) {
  const roomData = await getRoomData(roomId)
  const playersData = createArrayFromObject(roomData.players)
  const allAnswers = playersData.map((player) => player.answer)
  const playerData = await getPlayerData(roomId, playerId)
  const playerAnswer = playerData.answer
  const playerPhase = playerData.phase
  if (playerAnswer && playerPhase === 'answered') {
    const result = allAnswers.filter((answer) => answer === playerAnswer).length
    if (result === 2) {
      updateBlankSlatePlayer(roomId, playerId, { phase: 'waiting', points: playerData.points + 3 })
    } else if (result === 1) {
      updateBlankSlatePlayer(roomId, playerId, { phase: 'waiting' })
    } else {
      updateBlankSlatePlayer(roomId, playerId, { phase: 'waiting', points: playerData.points + 1 })
    }
  } else {
    updateBlankSlatePlayer(roomId, playerId, { phase: 'waiting' })
  }
}

export async function BlankSlateWinner(roomId) {
  const roomData = await getRoomData(roomId)
  const playersData = createArrayFromObject(roomData.players)
  const allPoints = playersData.map((player) => player.points)
  const maxPoint = Math.max(...allPoints)
  if (maxPoint >= 25) {
    return playersData.filter((player) => player.points === maxPoint).map((player) => player.name)
  }
  return null
}
