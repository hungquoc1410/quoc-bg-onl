import React, { useEffect, useState } from 'react'
import { Col, Layout, Row } from 'antd'
import { onValue } from 'firebase/database'
import { useParams } from 'react-router-dom'

import RoomHeader from '../../shared/layouts/room-header'
import Players from '../../shared/players/players'
import { checkRoom, setRoomRef } from '../../ultilities/firebase'

import BlankSlateGame from './components/game'
import BlankSlateWinner from './components/winner-data'
import WordModal from './components/word-modal'
import {
  BlankPlayerPoints,
  BlankPlayerWaiting,
  BlankSlateAnswer,
  BlankSlatePlaying,
} from './ultilities/blank-slate'

const { Content } = Layout

export default function BlankSlateIndex() {
  const [data, setData] = useState()
  const [wordModal, setWordModal] = useState(false)
  const [gameEnd, setGameEnd] = useState(false)
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
          case 'waiting':
            {
              const result = await BlankPlayerWaiting(roomData)
              if (result) {
                setGameEnd(true)
              }
            }
            break
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
        }
        return
      }
    })
  }, [])

  return (
    <>
      {data && (
        <>
          <Layout className='w-screen h-screen overflow-scroll'>
            <RoomHeader />
            <Content>
              <Row gutter={[0, 8]} className='w-full'>
                <Col xs={{ span: 24, order: 2 }} lg={{ span: 24, order: 1 }}>
                  <Row className='w-full p-4'>
                    <Col span={24}>
                      <Players roomData={data} />
                    </Col>
                  </Row>
                </Col>
                <Col xs={{ span: 24, order: 1 }} lg={{ span: 24, order: 2 }} className='p-4'>
                  {gameEnd ? (
                    <BlankSlateWinner roomData={data} />
                  ) : (
                    <BlankSlateGame players={data.players} round={data.round} />
                  )}
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
