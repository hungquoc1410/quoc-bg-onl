/* eslint-disable react/prop-types */
import React from 'react'
import { Col, Divider, Result, Row, Table, Typography } from 'antd'

import { createArrayFromObject } from '../../../ultilities/createArrayFromObject'

const { Title } = Typography

export default function BlankSlateWinner({ roomData }) {
  const playersData = createArrayFromObject(roomData.players)
  const data = playersData.map((player) => {
    return { key: player.id, name: player.name, points: player.points }
  })

  const allPoints = playersData.map((player) => player.points)
  const maxPoint = Math.max(...allPoints)
  const winnerNames = playersData
    .filter((player) => player.points === maxPoint)
    .map((player) => player.name)

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Points',
      dataIndex: 'points',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.points - b.points,
    },
  ]

  let title
  if (winnerNames.length > 1) {
    title = 'The winner are' + ' ' + winnerNames.join(', ')
  } else {
    title = 'The winner is' + ' ' + winnerNames[0]
  }

  return (
    <>
      <Row className='w-full'>
        <Col span={24}>
          <Title level={2} style={{ textAlign: 'center' }}>
            Game End!
          </Title>
        </Col>
      </Row>
      <Divider />
      <Row className='w-full'>
        <Row className='w-full'>
          <Result status='success' title={title} />
        </Row>
        <Row className='w-full p-8'>
          <Col xs={{ span: 24 }} lg={{ span: 8, offset: 8 }}>
            <Table columns={columns} dataSource={data} pagination={false} />;
          </Col>
        </Row>
      </Row>
    </>
  )
}
