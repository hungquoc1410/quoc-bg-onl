/* eslint-disable react/prop-types */
import React from 'react'
import { Card, Typography } from 'antd'

const { Text } = Typography

export default function Others({ player, playing }) {
  const { name, ready, answer } = player
  return (
    <Card
      hoverable
      title={name}
      actions={[
        !playing && (
          <Text key='ready' type={ready ? 'success' : 'danger'}>
            Ready
          </Text>
        ),
      ]}
    >
      {`Answer: ${answer}`}
    </Card>
  )
}
