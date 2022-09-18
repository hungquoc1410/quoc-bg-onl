/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Col, Divider, Rate, Row, Typography } from 'antd'

import { createArrayFromObject } from '../../ultilities/createArrayFromObject'

const { Title } = Typography

export default function Game({ players }) {
  const [playersData, setPlayersData] = useState()
  const colors = [
    '#e6261f',
    '#eb7532',
    '#f7d038',
    '#a3e048',
    '#49da9a',
    '#34bbe6',
    '#4355db',
    '#d23be7',
  ]

  useEffect(() => {
    setPlayersData(createArrayFromObject(players))
  }, [players])

  return (
    <>
      <Row gutter={[16, 16]} className='max-w-full'>
        <Col span={24}>
          <Title level={2} style={{ textAlign: 'center' }}>
            Points
          </Title>
        </Col>
      </Row>
      <Divider />
      <Row gutter={[16, 16]} className='max-w-full'>
        {playersData &&
          playersData.map((player, index) => {
            return (
              <Row key={player.id} gutter={[16, 16]} className='max-w-full w-full'>
                <Col span={8}>
                  <Title level={4} style={{ margin: 0, textAlign: 'right', color: colors[index] }}>
                    {player.name}
                  </Title>
                </Col>
                <Col span={16}>
                  <Rate
                    disabled
                    count={25}
                    value={player.points}
                    character={({ index }) => index + 1}
                    style={{ color: colors[index] }}
                  />
                </Col>
              </Row>
            )
          })}
      </Row>
    </>
  )
}
