import React, { useEffect, useState } from 'react'
import { Col, Layout, Row } from 'antd'
import { onValue } from 'firebase/database'
import { useParams } from 'react-router-dom'

import RoomHeader from '../../shared/layouts/room-header'
import Players from '../../shared/players/players'
import { checkRoom, setRoomRef } from '../../ultilities/firebase'

import CAHGame from './components/game'
import { CAHDraw, CAHPlaying, CAHPoint, CAHSubmit } from './ultilities/cards-against-humanity'

const { Content } = Layout

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
            return await CAHPlaying(roomData)
          case 'draw':
            return await CAHDraw(roomData)
          case 'submit':
            return await CAHSubmit(roomData)
          case 'point':
            return await CAHPoint(roomData)
        }
      }
    })
  }, [])

  return (
    <>
      {data && (
        <Layout className='w-screen h-screen overflow-scroll'>
          <RoomHeader />
          <Content>
            <Row gutter={[0, 8]} className='w-full'>
              <Col xs={{ span: 24, order: 2 }} lg={{ span: 24, order: 1 }}>
                <Row className='w-full p-0 lg:p-4'>
                  <Col span={24}>
                    <Players roomData={data} />
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
