/* eslint-disable react/prop-types */
import React from 'react'
import { Button, message } from 'antd'

import { createArrayFromObject } from '../ultilities/createArrayFromObject'
import { updateRoom } from '../ultilities/firebase'

export default function StartButton({ roomData }) {
  const startGame = async () => {
    if (roomData.numOfPlayers < roomData.minPlayer) {
      return message.error('Need 4 players to start the game!')
    }
    const playersData = createArrayFromObject(roomData.players)
    const allReady = !playersData.map((data) => data.phase === 'ready').includes(false)
    if (allReady) {
      return updateRoom(roomData.id, { phase: 'playing' })
    } else {
      const notReadyPlayers = playersData
        .filter((player) => player.phase === 'waiting')
        .map((player) => player.name)
      return notReadyPlayers.forEach((name) => message.error(`${name} is not ready!`))
    }
  }

  return (
    <Button size='large' shape='round' type='primary' onClick={() => startGame()}>
      Start Game
    </Button>
  )
}
