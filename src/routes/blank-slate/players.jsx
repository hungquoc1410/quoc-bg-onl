/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Col, Divider, Row } from 'antd'

import { createArrayFromObject } from '../../ultilities/createArrayFromObject'
import { getInfo } from '../../ultilities/info'

import Others from './players/others'
import You from './players/you'

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
        <Col span={12}>
          {others &&
            others.map((player) => {
              return <Others key={player.id} player={player} playing={playing} />
            })}
        </Col>
      </Row>
    </>
  )
}
