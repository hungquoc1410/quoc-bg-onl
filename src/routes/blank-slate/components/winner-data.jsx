/* eslint-disable react/prop-types */
import React from 'react'
import { Col, Row, Table } from 'antd'

export default function BlankSlateWinner({ data }) {
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

  return (
    <Row className='w-full p-8'>
      <Col xs={{ span: 24 }} lg={{ span: 8, offset: 8 }}>
        <Table columns={columns} dataSource={data} pagination={false} />;
      </Col>
    </Row>
  )
}
