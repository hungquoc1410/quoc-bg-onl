import React, { useEffect, useState } from 'react'
import { Col, Layout, Row, Space, Typography } from 'antd'
import { onValue } from 'firebase/database'
import { useNavigate, useParams } from 'react-router-dom'

import { checkRoom, setRoomRef } from '../../ultilities/firebase'

import Game from './components/game'
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
            const name = await BlankPlayerCount(roomData)
            if (name) {
              navigate('/winner', { state: { name: name } })
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
              <Row gutter={[8, 8]} className='h-full'>
                <Col span={8}>
                  <Space className='flex justify-center items-center'>
                    <Title level={3} style={{ color: 'white', margin: 0, textAlign: 'left' }}>
                      Room ID:
                    </Title>
                    <Title level={3} style={{ color: 'white', margin: 0 }} copyable>
                      {params.roomId}
                    </Title>
                  </Space>
                </Col>
                <Col span={8}>
                  <Space className='flex justify-center items-center w-full'>
                    <Title level={2} style={{ color: 'white', margin: 0, textAlign: 'center' }}>
                      Blank Slate
                    </Title>
                  </Space>
                </Col>
                <Col span={8}>
                  <Space className='flex justify-end items-center w-full'>
                    <Title
                      level={3}
                      style={{ color: 'white', margin: 0, textAlign: 'right' }}
                    >{`Round ${data.round}`}</Title>
                  </Space>
                </Col>
              </Row>
            </Header>
            <Content>
              <Row gutter={[8, 8]} className='max-w-full'>
                <Col span={8}>
                  <Row gutter={[8, 8]} className='max-w-full p-4'>
                    <Col span={24}>
                      <BlankSlatePlayers players={data.players} playing={data.phase != 'waiting'} />
                    </Col>
                  </Row>
                </Col>
                <Col span={16} className='p-4'>
                  <Game players={data.players} />
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
