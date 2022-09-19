/* eslint-disable react/prop-types */
import React from 'react'
import { Card, Typography } from 'antd'

const { Text } = Typography

export default function BlankSlateOthers({ player, playing }) {
  const { name, phase, answer, color } = player
  return (
    <Card
      hoverable
      title={name}
      actions={[
        !playing && (
          <Text key='ready' type={phase === 'ready' ? 'success' : 'danger'}>
            Ready
          </Text>
        ),
      ]}
      style={{ border: `6px solid ${color}` }}
    >
      {`Answer: ${answer}`}
    </Card>
  )
}
