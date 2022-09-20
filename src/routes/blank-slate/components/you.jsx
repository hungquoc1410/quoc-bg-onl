/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Avatar, Badge, Button, Col, Popover, Row, Space, Tooltip } from 'antd'
import { useParams } from 'react-router-dom'

import ChangeColorInput from '../../../shared/change-color-input'
import ChangeNameInput from '../../../shared/change-name-input'
import ReadyButton from '../../../shared/ready-button'
import StartButton from '../../../shared/start-button'
import { updateRoom } from '../../../ultilities/firebase'
import { invertColor } from '../../../ultilities/invertColor'

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
    if (roomData.phase === 'count') {
      await updateRoom(params.roomId, { phase: 'playing' })
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
            return <ReadyButton phase={phase} roomId={roomData.id} playerId={id} />
        }
      default:
        break
    }
  }

  return (
    <Row>
      <Col span={6}>
        <div className='flex justify-center items-center w-full h-full cursor-pointer'>
          <Popover
            overlayStyle={{ width: '20vw' }}
            placement='bottomRight'
            content={
              <div>
                <Row>
                  <ChangeNameInput
                    roomId={params.roomId}
                    playerId={id}
                    playerName={name}
                  ></ChangeNameInput>
                </Row>
                <Row>
                  <ChangeColorInput roomId={params.roomId} playerId={id} playerColor={color} />
                </Row>
              </div>
            }
            trigger='click'
            open={userSetting}
            onOpenChange={handleOpenChange}
          >
            <Tooltip title='Click to edit name and color' placement='topRight'>
              <Badge
                count={points}
                color={invertColor(color, false)}
                style={{ color: invertColor(invertColor(color, false), true) }}
              >
                <Avatar
                  size={64}
                  style={{
                    color: invertColor(color, true),
                    backgroundColor: color,
                    verticalAlign: 'middle',
                  }}
                >
                  {name[0]}
                </Avatar>
              </Badge>
            </Tooltip>
          </Popover>
        </div>
      </Col>
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
