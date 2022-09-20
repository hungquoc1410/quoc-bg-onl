/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Col, Divider, Row } from 'antd'

import { createArrayFromObject } from '../../../ultilities/createArrayFromObject'
import { getInfo } from '../../../ultilities/info'

import CAHOthers from './others'
import CAHYou from './you'

export default function CAHPlayers({ roomData }) {
  const playing = roomData.phase != 'waiting'
  const playersData = createArrayFromObject(roomData.players)
  const [you, setYou] = useState()
  const [others, setOthers] = useState()

  useEffect(() => {
    async function setUp() {
      const info = await getInfo()
      const playerId = info.playerId
      setYou(playersData.filter((player) => player.id === playerId)[0])
      setOthers(playersData.filter((player) => player.id != playerId))
    }
    setUp()
  }, [roomData])

  return (
    <>
      <Row gutter={[8, 0]} className='w-full'>
        <Col xs={24} lg={6}>
          <Divider style={{ margin: 0 }}>You</Divider>
          <Row className='w-full mt-4'>
            <Col span={24}>
              {you && <CAHYou roomData={roomData} playerData={you} playing={playing} />}
            </Col>
          </Row>
        </Col>
        <Col xs={24} lg={18}>
          <Divider style={{ margin: 0 }}>Others</Divider>
          <Row gutter={[0, 8]} className='flex justify-center w-full mt-4'>
            {others &&
              others.map((player) => {
                return (
                  <Col key={player.id} xs={4} lg={3}>
                    <div className='flex justify-center items-center w-full h-full'>
                      <CAHOthers player={player} playing={playing} />
                    </div>
                  </Col>
                )
              })}
          </Row>
        </Col>
      </Row>
    </>
  )
}
