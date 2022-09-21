/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Button, Col, Row, Space } from 'antd'
import { useParams } from 'react-router-dom'

import ReadyButton from '../../../shared/buttons/ready-button'
import StartButton from '../../../shared/buttons/start-button'
import You from '../../../shared/players/you'
import { updateRoom } from '../../../ultilities/firebase'
import { BlankSlateReset } from '../ultilities/blank-slate'

export default function BlankSlateYou({ roomData, playerData }) {
  const { name, id, color, points, master, phase } = playerData
  const { round } = roomData
  const roomPhase = roomData.phase
  const [userSetting, setUserSetting] = useState(false)
  const params = useParams()

  const handleOpenChange = (newOpen) => {
    setUserSetting(newOpen)
  }

  const nextRound = async () => {
    if (roomData.phase === 'waiting') {
      await updateRoom(params.roomId, { phase: 'playing' })
    }
    return
  }

  const newGame = async () => {
    if (roomData.phase === 'win') {
      await BlankSlateReset(roomData)
    }
    return
  }

  const functions = () => {
    switch (roomPhase) {
      case 'waiting':
        switch (master) {
          case true:
            switch (round) {
              case 0:
                return (
                  <>
                    <StartButton roomData={roomData} />
                    <ReadyButton phase={phase} roomId={roomData.id} playerId={id} />
                  </>
                )
              default:
                return (
                  <Button
                    size='large'
                    shape='round'
                    type='primary'
                    onClick={() => {
                      nextRound()
                    }}
                  >
                    Next Round
                  </Button>
                )
            }
          default:
            switch (round) {
              case 0:
                return <ReadyButton phase={phase} roomId={roomData.id} playerId={id} />
              default:
                break
            }
        }
        break
      case 'win':
        switch (master) {
          case true:
            return (
              <Button
                size='large'
                shape='round'
                type='primary'
                onClick={() => {
                  newGame()
                }}
              >
                New Game
              </Button>
            )
          default:
            break
        }
    }
  }

  return (
    <Row>
      <You
        playerId={id}
        name={name}
        color={color}
        points={points}
        userSetting={userSetting}
        handleOpenChange={handleOpenChange}
      />
      <Col span={18}>
        <div className='flex justify-center items-center w-full h-full'>
          <Space wrap={true} className='flex justify-center items-center w-full h-full'>
            {functions()}
          </Space>
        </div>
      </Col>
    </Row>
  )
}
