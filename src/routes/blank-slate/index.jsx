import React, { useEffect, useState } from 'react'
import { Col, Layout, Row, Space, Typography } from 'antd'
import { onValue } from 'firebase/database'
import { useNavigate, useParams } from 'react-router-dom'

import { setRoomRef } from '../../ultilities/firebase'
import { getInfo } from '../../ultilities/info'

import WordModal from './game/word-modal'
import {
  BlankSlateWinner,
  checkBlankSlate,
  checkPlayerCount,
  checkPlayerPoints,
  setBlankSlatePlayerPoint,
} from './blank-slate'
import Game from './game'
import BlankSlatePlayers from './players'

const { Content, Header } = Layout
const { Title } = Typography

export default function BlankSlateIndex() {
  const [data, setData] = useState()
  const [wordModal, setWordModal] = useState(false)
  const params = useParams()
  const roomRef = setRoomRef(params.roomId)
  const navigate = useNavigate()

  useEffect(() => {
    return onValue(roomRef, async (snapshot) => {
      if (snapshot.exists()) {
        checkBlankSlate(params.roomId)
        const roomData = snapshot.val()
        if (roomData.round != 0 && roomData.phase === 'answer') {
          setWordModal(true)
        } else if (roomData.round != 0 && roomData.phase === 'points') {
          checkPlayerPoints(params.roomId)
        } else if (roomData.round != 0 && roomData.phase === 'count') {
          const info = await getInfo()
          const { playerId } = info
          await setBlankSlatePlayerPoint(params.roomId, playerId)
          checkPlayerCount(params.roomId)
        } else if (roomData.round != 0 && roomData.phase === 'waiting') {
          const name = await BlankSlateWinner(params.roomId)
          if (name) {
            navigate('/winner', { state: { name: name } })
          }
        }
        return setData(roomData)
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
                      <BlankSlatePlayers players={data.players} playing={data.playing} />
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
