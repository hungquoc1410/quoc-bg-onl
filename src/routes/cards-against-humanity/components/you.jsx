/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Avatar, Badge, Button, Col, message, Popover, Row, Space, Tooltip } from 'antd'
import { useParams } from 'react-router-dom'

import ChangeColorInput from '../../../shared/change-color-input'
import ChangeNameInput from '../../../shared/change-name-input'
import ReadyButton from '../../../shared/ready-button'
import StartButton from '../../../shared/start-button'
import { updateRoom } from '../../../ultilities/firebase'
import { invertColor } from '../../../ultilities/invertColor'
import { CAHReset } from '../ultilities/cards-against-humanity'

import MyCards from './whiteCards'

export default function CAHYou({ roomData, playerData }) {
  const { name, color, id, master, phase, cards, points } = playerData
  const roomPhase = roomData.phase
  const { confirmWhite, round } = roomData
  const [userSetting, setUserSetting] = useState(false)
  const [drawed, setDrawed] = useState(false)
  const [confirm, setConfirm] = useState(false)
  const [openCards, setOpenCards] = useState(false)
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

  const confirmChoseCard = async () => {
    if (confirmWhite) {
      return await updateRoom(roomData.id, { phase: 'point' })
    } else {
      message.error('You must choose a card!')
    }
  }

  const nextRound = async () => {
    setDrawed(false)
    setConfirm(false)
    return await CAHReset(roomData)
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
                    <ReadyButton phase={phase} roomId={params.roomId} playerId={id} />
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
            return <ReadyButton phase={phase} roomId={params.roomId} playerId={id} />
        }
      case 'playing':
        {
          switch (master) {
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
      case 'submit':
        switch (master) {
          case true:
            break
          default:
            switch (phase) {
              case 'drawed':
                return (
                  <Button
                    size='large'
                    shape='round'
                    type='primary'
                    onClick={() => {
                      setOpenCards(true)
                    }}
                  >
                    My Cards
                  </Button>
                )
              case 'submitted':
                break
            }
        }
        break
      case 'choose':
        switch (master) {
          case true:
            return (
              <Button
                size='large'
                shape='round'
                type='primary'
                onClick={() => {
                  confirmChoseCard()
                }}
              >
                Confirm
              </Button>
            )

          default:
            break
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
      <MyCards
        open={openCards}
        setOpen={setOpenCards}
        black={roomData.currentBlack}
        whites={cards}
        roomId={roomData.id}
        playerId={id}
      />
    </>
  )
}
