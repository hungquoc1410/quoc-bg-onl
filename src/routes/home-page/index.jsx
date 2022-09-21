import React, { useState } from 'react'
import { Button, Card, Col, Divider, Input, Layout, message, Row, Tooltip, Typography } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

import ChangeColorInput from '../../shared/buttons/change-color-input'
import ChangeNameInput from '../../shared/buttons/change-name-input'
import { getRoomsData } from '../../ultilities/firebase'
import { gameData } from '../../ultilities/games'
import { getInfo, setInfo } from '../../ultilities/info'
import { BlankSlatePlayer, BlankSlateRoom } from '../blank-slate/ultilities/blank-slate'
import { CAHPlayer, CAHRoom } from '../cards-against-humanity/ultilities/cards-against-humanity'

const { Header, Content } = Layout
const { Meta } = Card
const { Title } = Typography

export default function HomePageIndex() {
  const navigate = useNavigate()
  const location = useLocation()
  const [inputRoomId, setInputRoomId] = useState('')
  const [name, setName] = useState()
  const [color, setColor] = useState()

  const setUp = async () => {
    const info = await getInfo()
    const { playerName, playerColor } = info
    setName(playerName || 'Your Name')
    setColor(playerColor || 'Your Color')
  }

  if (location.pathname === '/') {
    setUp()
  }

  async function createRoom(game) {
    const id = Math.random().toString(36).substring(2, 9)
    const info = await getInfo()
    const { playerId, playerName, playerColor } = info
    await setInfo({ roomId: id, gameId: game })
    switch (game) {
      case 'blankslate':
        await BlankSlateRoom(id, game)
        await BlankSlatePlayer(id, playerId, playerName, playerColor, true)
        break
      case 'cah':
        await CAHRoom(id, game)
        await CAHPlayer(id, playerId, playerName, playerColor, true)
        break
    }
    return navigate(`${id}/${game}`)
  }

  async function joinRoom() {
    const roomsData = await getRoomsData()
    const allRooms = Object.keys(roomsData)
    if (allRooms.includes(inputRoomId)) {
      const roomData = roomsData[inputRoomId]
      if (roomData.phase != 'waiting') {
        message.error('Room is playing!')
      } else if (roomData.numOfPlayers === roomData.maxPlayer) {
        message.error('Room is full!')
      } else {
        await setInfo({ roomId: inputRoomId, gameId: roomData.game })
        const info = await getInfo()
        switch (roomData.game) {
          case 'blankslate':
            await BlankSlatePlayer(inputRoomId, info.playerId)
            break
          case 'cah':
            await CAHPlayer(inputRoomId, info.playerId)
            break
        }
        navigate(`${inputRoomId}/${roomData.game}`)
      }
    } else {
      message.error('Room does not exist!')
    }
    setInputRoomId('')
  }

  return (
    <Layout className='w-screen h-screen overflow-scroll'>
      <Header className='flex items-center justify-center'>
        <Title level={4} style={{ color: 'white', margin: 0 }}>
          Nathan Board Game Online
        </Title>
      </Header>
      <Content className='p-8'>
        <Row
          className='w-full lg:!justify-center lg:!gap-4'
          justify='space-evenly'
          gutter={[0, 32]}
        >
          <Col xs={24} lg={4}>
            <Row className='w-full' justify='space-evenly' gutter={[0, 8]}>
              <Col span={24}>{name && <ChangeNameInput playerName={name} homepage={true} />}</Col>
              <Col span={24}>
                {color && <ChangeColorInput playerColor={color} homepage={true} />}
              </Col>
            </Row>
          </Col>
          <Col xs={24} lg={4}>
            <Input.Group compact>
              <Input
                style={{ width: '60%' }}
                placeholder='Room ID'
                value={inputRoomId}
                onChange={(e) => {
                  setInputRoomId(e.target.value)
                }}
              />
              <Button
                style={{ width: '40%' }}
                type='primary'
                onClick={() => {
                  joinRoom()
                }}
              >
                Join Room
              </Button>
            </Input.Group>
          </Col>
        </Row>
        <Divider />
        <Row
          className='w-full lg:!justify-center lg:!gap-4'
          justify='space-evenly'
          gutter={[0, 32]}
        >
          {gameData.map((game) => {
            return (
              <Col key={game.title} xs={24} lg={4}>
                <Tooltip title='Click to create a room!'>
                  <Card
                    onClick={() => {
                      createRoom(game.link)
                    }}
                    hoverable
                    cover={
                      <div className='aspect-square overflow-hidden'>
                        <img alt={game.title} src={game.image} className='w-full' />
                      </div>
                    }
                  >
                    <Meta title={game.title} description={game.description} />
                  </Card>
                </Tooltip>
              </Col>
            )
          })}
        </Row>
      </Content>
    </Layout>
  )
}
