/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Button, Card, message, Typography } from 'antd'
import { useParams } from 'react-router-dom'

import { createArrayFromObject } from '../../../ultilities/createArrayFromObject'
import { getRoomData } from '../../../ultilities/firebase'
import { setCurrentWord, updateBlankSlatePlayer, updateBlankSlateRoom } from '../blank-slate'

const { Text, Paragraph } = Typography

export default function You({ data, playing }) {
  const { name, ready, id, master, answer } = data
  const params = useParams()
  const [yourName, setYourName] = useState(name)

  const errorMessage = (text) => {
    message.error({ content: text, duration: 1 })
  }

  const changeName = async (string) => {
    await updateBlankSlatePlayer(params.roomId, id, { name: string })
    setYourName(string)
  }

  async function startGame() {
    const roomData = await getRoomData(params.roomId)
    if (roomData.numOfPlayers < roomData.minPlayer) {
      return errorMessage('Not enough players to start!')
    }
    const playersData = createArrayFromObject(roomData.players)
    const result = !playersData
      .map((data) => {
        return data.ready
      })
      .includes(false)
    if (result) {
      updateBlankSlateRoom(params.roomId, { playing: true, phase: 'answer', round: 1 })
      setCurrentWord(params.roomId)
    } else {
      const notReadyPlayers = playersData
        .filter((player) => !player.ready)
        .map((player) => player.name)
      return notReadyPlayers.forEach((name) => errorMessage(`${name} is not ready!`))
    }
  }

  async function nextRound() {
    const roomData = await getRoomData(params.roomId)
    if (roomData.phase === 'waiting') {
      updateBlankSlateRoom(params.roomId, { phase: 'answer', round: roomData.round + 1 })
      return setCurrentWord(params.roomId)
    }
    return null
  }

  return (
    <Card
      title={
        <Paragraph
          editable={{ onChange: changeName, maxLength: 20, triggerType: ['text', 'icon'] }}
        >
          {yourName}
        </Paragraph>
      }
      actions={[
        master &&
          (!playing ? (
            <Button
              key='master'
              size='large'
              shape='round'
              type='primary'
              onClick={() => {
                startGame()
              }}
            >
              Start Game
            </Button>
          ) : (
            <Button
              key='nextRound'
              size='large'
              shape='round'
              type='primary'
              onClick={() => {
                nextRound()
              }}
            >
              Next Round
            </Button>
          )),
        !playing && (
          <Button
            key='ready'
            size='large'
            shape='round'
            onClick={() => {
              updateBlankSlatePlayer(params.roomId, id, { ready: !ready })
            }}
          >
            <Text type={ready ? 'success' : 'danger'}>Ready</Text>
          </Button>
        ),
      ]}
    >
      {`Answer: ${answer}`}
    </Card>
  )
}
