import React from 'react'
import { Button, Col, Result, Row, Table } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Winner() {
  const { state } = useLocation()
  const navigate = useNavigate()
  let title
  if (state.name.length > 1) {
    title = 'The winner are' + ' ' + state.name.join(', ')
  } else {
    title = 'The winner is' + ' ' + state.name[0]
  }

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
    <>
      <Result
        status='success'
        title={title}
        extra={[
          <Button
            type='primary'
            key='homepage'
            onClick={() => {
              navigate(-1)
            }}
          >
            Back to Room!
          </Button>,
        ]}
      />
      <Row className='w-full p-8'>
        <Col xs={{ span: 24 }} lg={{ span: 8, offset: 8 }}>
          <Table columns={columns} dataSource={state.data} pagination={false} />;
        </Col>
      </Row>
    </>
  )
}
