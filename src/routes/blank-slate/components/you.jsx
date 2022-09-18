/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Button, Card, message, Select, Typography } from 'antd'
import { useParams } from 'react-router-dom'

import { colorsData } from '../../../ultilities/colors'
import { createArrayFromObject } from '../../../ultilities/createArrayFromObject'
import { getRoomData, updatePlayer, updateRoom } from '../../../ultilities/firebase'

const { Text, Paragraph } = Typography
const { Option } = Select

export default function You({ data, playing }) {
  const { name, phase, id, master, answer, color } = data
  const params = useParams()
  const [yourName, setYourName] = useState(name)

  const changeName = async (string) => {
    await updatePlayer(params.roomId, id, { name: string })
    return setYourName(string)
  }

  const changeColor = async (value) => {
    return await updatePlayer(params.roomId, id, { color: value })
  }

  const changeReady = async () => {
    switch (phase) {
      case 'ready':
        updatePlayer(params.roomId, id, { phase: 'waiting' })
        break
      case 'waiting':
        updatePlayer(params.roomId, id, { phase: 'ready' })
        break
    }
  }

  async function startGame() {
    const roomData = await getRoomData(params.roomId)
    if (roomData.numOfPlayers < roomData.minPlayer) {
      return message.error('Need 3 players to start the game!')
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

  async function nextRound() {
    const roomData = await getRoomData(params.roomId)
    if (roomData.phase === 'count') {
      await updateRoom(params.roomId, { phase: 'playing' })
    }
    return
  }

  return (
    <Card
      title={
        <Paragraph
          style={{ width: 210 }}
          editable={{ onChange: changeName, maxLength: 20, triggerType: ['text', 'icon'] }}
        >
          {yourName}
        </Paragraph>
      }
      actions={[
        master &&
          (playing ? (
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
          ) : (
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
          )),
        !playing && (
          <Button key='ready' size='large' shape='round' onClick={() => changeReady()}>
            <Text type={phase === 'ready' ? 'success' : 'danger'}>Ready</Text>
          </Button>
        ),
      ]}
      style={{ border: `6px solid ${color}` }}
    >
      <Card.Grid
        hoverable={false}
        style={{
          width: '50%',
        }}
      >
        {`Answer: ${answer}`}
      </Card.Grid>
      <Card.Grid
        hoverable={false}
        style={{
          width: '50%',
        }}
      >
        <Select key='color' defaultValue={color} onChange={changeColor} style={{ width: '100%' }}>
          {colorsData.map((color) => (
            <Option
              key={color.name}
              value={color.color}
              style={{ color: color.color, backgroundColor: color.color }}
            >
              {color.name}
            </Option>
          ))}
        </Select>
      </Card.Grid>
    </Card>
  )
}
