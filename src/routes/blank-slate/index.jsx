import React, { useEffect, useState } from 'react'
import { Col, Layout, Row, Space, Typography } from 'antd'
import { onValue } from 'firebase/database'
import { useNavigate, useParams } from 'react-router-dom'

import { checkRoom, setRoomRef } from '../../ultilities/firebase'

import BlankSlateGame from './components/game'
import BlankSlatePlayers from './components/players'
import WordModal from './components/word-modal'
import {
  BlankPlayerCount,
  BlankPlayerPoints,
  BlankSlateAnswer,
  BlankSlatePlaying,
} from './ultilities/blank-slate'

const { Content, Header } = Layout
const { Title } = Typography

export default function BlankSlateIndex() {
  const [data, setData] = useState()
  const [wordModal, setWordModal] = useState(false)
  const params = useParams()
  const navigate = useNavigate()
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
            await BlankSlatePlaying(roomData)
            setWordModal(true)
            break
          case 'answer':
            BlankSlateAnswer(roomData)
            break
          case 'points':
            BlankPlayerPoints(roomData)
            break
          case 'count': {
            const result = await BlankPlayerCount(roomData)
            if (result) {
              navigate('/winner', { state: result })
            }
            break
          }
        }
        return
      }
    })
  }, [])

  return (
    <>
      {data && (
        <>
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
              <Row gutter={{ xs: [0, 8], lg: 8 }} className='w-full '>
                <Col xs={{ span: 24, order: 2 }} lg={{ span: 8, order: 1 }}>
                  <Row className='w-full p-4'>
                    <Col span={24}>
                      <BlankSlatePlayers players={data.players} playing={data.phase != 'waiting'} />
                    </Col>
                  </Row>
                </Col>
                <Col xs={{ span: 24, order: 1 }} lg={{ span: 16, order: 2 }} className='p-4'>
                  <BlankSlateGame players={data.players} round={data.round} />
                </Col>
              </Row>
            </Content>
          </Layout>
          <WordModal wordModal={wordModal} setWordModal={setWordModal} word={data.current} />
        </>
      )}
    </>
  )
}
