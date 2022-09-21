import React from 'react'
import { Layout, Space, Typography } from 'antd'
import { useParams } from 'react-router-dom'

const { Header } = Layout
const { Title } = Typography

export default function RoomHeader() {
  const params = useParams()

  return (
    <Header>
      <Space className='flex justify-center items-center w-full'>
        <Title level={4} style={{ color: 'white', margin: 0, textAlign: 'center' }}>
          Room ID:
        </Title>
        <Title level={4} style={{ color: 'white', margin: 0 }} copyable>
          {params.roomId}
        </Title>
      </Space>
    </Header>
  )
}
