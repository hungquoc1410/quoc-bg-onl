/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Col, Divider, Row } from 'antd'

import { createArrayFromObject } from '../../../ultilities/createArrayFromObject'
import { getInfo } from '../../../ultilities/info'

import BlankSlateOthers from './others'
import BlankSlateYou from './you'

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
      <Row className='w-full'>
        <Col span={24}>{you && <BlankSlateYou data={you} playing={playing} />}</Col>
      </Row>
      <Divider>Others</Divider>
      <Row gutter={{ xs: [0, 8], lg: 8 }} className='w-full'>
        {others &&
          others.map((player) => {
            return (
              <Col key={player.id} xs={24} lg={12}>
                <BlankSlateOthers player={player} playing={playing} />
              </Col>
            )
          })}
      </Row>
    </>
  )
}
