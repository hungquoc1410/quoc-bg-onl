import _ from 'underscore'

import { generateColor } from '../../../ultilities/colors'
import { createArrayFromObject } from '../../../ultilities/createArrayFromObject'
import { createPlayer, createRoom, updatePlayer, updateRoom } from '../../../ultilities/firebase'
import generateName from '../../../ultilities/generateName'
import { shuffleArray } from '../../../ultilities/shuffleArray'

import { blackCardsData } from './blackCards'
import { whiteCardsData } from './whiteCards'

export const CAHRoom = async (roomId, gameId) => {
  const roomData = {
    id: roomId,
    game: gameId,
    minPlayer: 4,
    maxPlayer: 10,
    blackCards: blackCardsData,
    whiteCards: whiteCardsData,
    currentBlack: '',
    confirmBlack: false,
    currentWhites: '',
    confirmWhite: '',
    round: 0,
    numOfPlayers: 1,
    phase: 'waiting',
  }
  return await createRoom(roomId, roomData)
}

export const CAHPlayer = async (roomId, playerId, master = false, drawer = false) => {
  const playerData = {
    id: playerId,
    points: 0,
    currentWhite: '',
    name: generateName(),
    color: generateColor(),
    master,
    drawer,
    cards: [],
    phase: 'waiting',
  }
  return await createPlayer(roomId, playerId, playerData)
}

export const CAHPlaying = async (roomData) => {
  const confirmBlack = roomData.confirmBlack
  if (confirmBlack) {
    return await updateRoom(roomData.id, { phase: 'draw', confirmBlack: false })
  }
}

export const CAHDraw = async (roomData) => {
  const { id, whiteCards } = roomData
  const playersData = createArrayFromObject(roomData.players)
  const distributedWhites = playersData.map((player) => player.cards || []).flat()
  const remainingWhites = _.difference(whiteCards, distributedWhites)
  const allDrawed = !playersData.map((player) => player.phase === 'drawed').includes(false)
  if (allDrawed) {
    return await updateRoom(id, { phase: 'submit', whiteCards: remainingWhites })
  }
  const notDrawPlayers = playersData.filter((player) => player.phase != 'drawed')
  notDrawPlayers.forEach(async (player) => {
    const playerCards = player.cards
    let newCards
    if (!playerCards) {
      newCards = shuffleArray(remainingWhites).splice(1, 10)
    } else {
      if (playerCards.length === 10) {
        newCards = playerCards
      } else if (playerCards.length > 0) {
        newCards = playerCards.concat(
          shuffleArray(remainingWhites).splice(1, 10 - playerCards.length),
        )
      }
    }
    return await updatePlayer(id, player.id, { cards: newCards, phase: 'drawed' })
  })
}

export const CAHSubmit = async (roomData) => {
  const playersData = createArrayFromObject(roomData.players).filter(
    (player) => player.drawer === false,
  )
  const allSubmitted = !playersData.map((player) => player.phase === 'submitted').includes(false)
  if (allSubmitted) {
    const currentWhites = playersData.map((player) => player.currentWhite)
    return await updateRoom(roomData.id, { currentWhites, phase: 'choose' })
  }
}
