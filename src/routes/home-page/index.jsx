import React, { useState } from 'react'
import { Button, Card, Input, Layout, message, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'

import { getRoomData, getRoomsData } from '../../ultilities/firebase'
import { getInfo, setInfo } from '../../ultilities/info'
import { BlankSlatePlayer, BlankSlateRoom } from '../blank-slate/blank-slate'

const { Header, Content } = Layout
const { Meta } = Card
const { Title } = Typography

export default function HomePageIndex() {
  const navigate = useNavigate()
  const [inputRoomId, setInputRoomId] = useState('')

  async function createRoom(game) {
    const id = Math.random().toString(36).substring(2, 9)
    await setInfo({ roomId: id, gameId: game })
    await BlankSlateRoom(id, game)
    const info = await getInfo()
    await BlankSlatePlayer(id, info.playerId, true)
    navigate(`${id}/${game}`)
  }

  async function joinRoom() {
    const roomsData = await getRoomsData()
    const allRooms = Object.keys(roomsData)
    if (allRooms.includes(inputRoomId)) {
      const roomData = await getRoomData(inputRoomId)
      if (roomData.playing) {
        errorJoinRoom('Room is playing')
      } else if (Object.keys(roomData.players).length === roomData.maxPlayer) {
        errorJoinRoom('Room is full!')
      } else {
        await setInfo({ roomId: inputRoomId, gameId: roomData.game })
        const info = await getInfo()
        await BlankSlatePlayer(inputRoomId, info.playerId)
        navigate(`${inputRoomId}/${roomData.game}`)
      }
    } else {
      errorJoinRoom('Room does not exist!')
    }
    setInputRoomId('')
  }

  const errorJoinRoom = (text) => {
    message.error(text)
  }

  return (
    <Layout className='w-screen h-screen'>
      <Header className='flex items-center justify-between'>
        <Title level={2} style={{ color: 'white', margin: 0 }}>
          Nathan Board Game Online
        </Title>
        <Input.Group compact style={{ width: '20%' }}>
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
      </Header>
      <Content className='p-8'>
        <Card
          onClick={() => {
            createRoom('blankslate')
          }}
          hoverable
          style={{
            width: 240,
          }}
          cover={
            <img
              alt='blank-slate'
              src='https://cf.geekdo-images.com/3esMv2fRjFZHNM8IbGG-kw__itemrep/img/LTD6KNm2SQPmoNPtY_tOu2BWdI0=/fit-in/246x300/filters:strip_icc()/pic4163219.jpg'
            />
          }
        >
          <Meta title='Blank Slate' description='The game where _______ minds think alike.' />
        </Card>
      </Content>
    </Layout>
  )
}
