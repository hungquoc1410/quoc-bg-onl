/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Avatar, Button, Col, Popover, Row, Space, Tooltip } from 'antd'
import { useParams } from 'react-router-dom'

import ChangeColorInput from '../../../shared/change-color-input'
import ChangeNameInput from '../../../shared/change-name-input'
import ReadyButton from '../../../shared/ready-button'
import StartButton from '../../../shared/start-button'
import { updateRoom } from '../../../ultilities/firebase'
import { invertColor } from '../../../ultilities/invertColor'

export default function CAHYou({ roomData, playerData }) {
  const { name, color, id, master, phase, drawer } = playerData
  const roomPhase = roomData.phase
  const [userSetting, setUserSetting] = useState(false)
  const [drawed, setDrawed] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const params = useParams()

  const handleOpenChange = (newOpen) => {
    setUserSetting(newOpen)
  }

  const drawCard = async () => {
    setDrawed(true)
    const blackCards = roomData.blackCards
    const randomIndex = Math.floor(Math.random() * blackCards.length)
    const current = blackCards.splice(randomIndex, 1)
    return await updateRoom(roomData.id, {
      blackCards,
      currentBlack: current[0],
    })
  }

  const confirmDrawCard = async () => {
    setConfirm(true)
    return await updateRoom(roomData.id, {
      confirmBlack: true,
    })
  }

  const functions = () => {
    switch (roomPhase) {
      case 'waiting':
        switch (master) {
          case true:
            return (
              <>
                <StartButton roomData={roomData} />
                <ReadyButton phase={phase} roomId={params.roomId} playerId={id} />
              </>
            )

          default:
            return <ReadyButton phase={phase} roomId={params.roomId} playerId={id} />
        }

      case 'playing':
        {
          switch (drawer) {
            case true:
              switch (drawed) {
                case true:
                  switch (confirm) {
                    case true:
                      break
                    default:
                      return (
                        <>
                          <Button
                            size='large'
                            shape='round'
                            type='primary'
                            onClick={() => {
                              drawCard()
                            }}
                          >
                            Draw Another Card
                          </Button>
                          <Button
                            size='large'
                            shape='round'
                            onClick={() => {
                              confirmDrawCard()
                            }}
                          >
                            Confirm
                          </Button>
                        </>
                      )
                  }
                  break
                default:
                  return (
                    <Button
                      size='large'
                      shape='round'
                      type='primary'
                      onClick={() => {
                        drawCard()
                      }}
                    >
                      Draw Card
                    </Button>
                  )
              }
              break
            default:
              break
          }
        }
        break
      default:
        break
    }
  }

  return (
    <>
      <Row>
        <Col span={6}>
          <div className='flex justify-center items-center w-full h-full cursor-pointer'>
            <Popover
              overlayStyle={{ width: '40vh' }}
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
                <Avatar
                  size={64}
                  style={{
                    color: invertColor(color),
                    backgroundColor: color,
                    verticalAlign: 'middle',
                  }}
                >
                  {name[0]}
                </Avatar>
              </Tooltip>
            </Popover>
          </div>
        </Col>
        <Col span={18}>
          <div className='flex justify-center items-center w-full h-full'>
            <Space>{functions()}</Space>
          </div>
        </Col>
      </Row>
    </>
  )
}
