/* eslint-disable react/prop-types */
import React from 'react'
import { Col, Divider, Row, Table, Tag, Typography } from 'antd'

import { createArrayFromObject } from '../../../ultilities/createArrayFromObject'

const { Title } = Typography

export default function BlankSlateGame({ players, round }) {
  const playersData = createArrayFromObject(players)

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (name) => {
        return (
          <Tag color={name.color} key={name.name}>
            {name.name}
          </Tag>
        )
      },
    },
    {
      title: 'Answer',
      dataIndex: 'answer',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.answer - b.asnwer,
    },
    {
      title: 'Points',
      dataIndex: 'points',
    },
  ]

  const data = playersData.map((player) => {
    return {
      key: player.id,
      name: { name: player.name, color: player.color },
      answer: player.answer,
      points: player.points,
    }
  })

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
        <Row className='w-full p-8'>
          <Col xs={{ span: 24 }} lg={{ span: 8, offset: 8 }}>
            <Table columns={columns} dataSource={data} pagination={false} />;
          </Col>
        </Row>
      </Row>
    </>
  )
}
