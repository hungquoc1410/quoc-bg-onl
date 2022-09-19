import { generateColor } from '../../../ultilities/colors'
import { createPlayer, createRoom } from '../../../ultilities/firebase'
import generateName from '../../../ultilities/generateName'

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
    currentWhites: '',
    choseCard: '',
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
