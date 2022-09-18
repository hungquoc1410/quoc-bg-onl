/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Col, Divider, Row } from 'antd'

import { createArrayFromObject } from '../../../ultilities/createArrayFromObject'
import { getInfo } from '../../../ultilities/info'

import Others from './others'
import You from './you'

export default function BlankSlatePlayers({ players, playing }) {
  const playersData = createArrayFromObject(players)
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
  }, [players])

  return (
    <>
      <Row gutter={[8, 8]} className='max-w-full'>
        <Col span={24}>{you && <You data={you} playing={playing} />}</Col>
      </Row>
      <Divider>Others</Divider>
      <Row gutter={[8, 8]} className='max-w-full'>
        {others &&
          others.map((player) => {
            return (
              <Col key={player.id} span={12}>
                <Others player={player} playing={playing} />
              </Col>
            )
          })}
      </Row>
    </>
  )
}
