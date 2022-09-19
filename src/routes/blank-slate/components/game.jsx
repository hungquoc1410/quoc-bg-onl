/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Col, Divider, Rate, Row, Typography } from 'antd'

import { createArrayFromObject } from '../../../ultilities/createArrayFromObject'

const { Title } = Typography

export default function BlankSlateGame({ players, round }) {
  const [playersData, setPlayersData] = useState()

  useEffect(() => {
    setPlayersData(createArrayFromObject(players))
  }, [players])

  return (
    <>
      <Row className='w-full'>
        <Col span={24}>
          <Title level={2} style={{ textAlign: 'center' }}>
            {`Round: ${round}`}
          </Title>
        </Col>
      </Row>
      <Divider />
      <Row className='w-full'>
        {playersData &&
          playersData.map((player) => {
            return (
              <Row key={player.id} gutter={{ xs: [0, 16], lg: 16 }} className='w-full'>
                <Col xs={24} lg={8}>
                  <Title level={4} style={{ margin: 0, textAlign: 'center', color: player.color }}>
                    {player.name}
                  </Title>
                </Col>
                <Col xs={24} lg={16}>
                  <Rate
                    disabled
                    count={25}
                    value={player.points}
                    character={({ index }) => index + 1}
                    style={{ color: player.color }}
                  />
                </Col>
              </Row>
            )
          })}
      </Row>
    </>
  )
}
