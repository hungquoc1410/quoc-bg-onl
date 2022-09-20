import React, { useEffect, useState } from 'react'
import { Col, Layout, Row, Space, Typography } from 'antd'
import { onValue } from 'firebase/database'
import { useParams } from 'react-router-dom'

import { checkRoom, setRoomRef } from '../../ultilities/firebase'

import CAHGame from './components/game'
import CAHPlayers from './components/players'
import { CAHDraw, CAHPlaying } from './ultilities/cards-against-humanity'

const { Header, Content } = Layout
const { Title } = Typography

export default function CAHIndex() {
  const [data, setData] = useState()
  const params = useParams()
  const roomRef = setRoomRef(params.roomId)

  useEffect(() => {
    return onValue(roomRef, async (snapshot) => {
      if (snapshot.exists()) {
        const roomData = snapshot.val()
        setData(roomData)
        const roomPhase = roomData.phase
        checkRoom(roomData)
        switch (roomPhase) {
          case 'playing':
            CAHPlaying(roomData)
            break
          case 'draw':
            CAHDraw(roomData)
            break
        }
      }
    })
  }, [])

  return (
    <>
      {data && (
        <Layout className='w-screen h-screen'>
          <Header>
            <Space className='flex justify-center items-center w-full'>
              <Title level={4} style={{ color: 'white', margin: 0, textAlign: 'center' }}>
                Room ID:
              </Title>
              <Title level={4} style={{ color: 'white', margin: 0 }} copyable>
                {params.roomId}
              </Title>
            </Space>
          </Header>
          <Content>
            <Row gutter={[0, 8]} className='w-full'>
              <Col xs={{ span: 24, order: 2 }} lg={{ span: 24, order: 1 }}>
                <Row className='w-full p-4'>
                  <Col span={24}>
                    <CAHPlayers
                      roomData={data}
                      players={data.players}
                      playing={data.phase != 'waiting'}
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={{ span: 24, order: 1 }} lg={{ span: 24, order: 2 }} className='p-4'>
                <CAHGame roomData={data} players={data.players} round={data.round} />
              </Col>
            </Row>
          </Content>
        </Layout>
      )}
    </>
  )
}
