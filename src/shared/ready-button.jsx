/* eslint-disable react/prop-types */
import React from 'react'
import { Button, Typography } from 'antd'

import { updatePlayer } from '../ultilities/firebase'

const { Text } = Typography

export default function ReadyButton({ phase, roomId, playerId }) {
  const changeReady = async () => {
    switch (phase) {
      case 'ready':
        updatePlayer(roomId, playerId, { phase: 'waiting' })
        break
      case 'waiting':
        updatePlayer(roomId, playerId, { phase: 'ready' })
        break
    }
  }

  return (
    <Button key='ready' size='large' shape='round' onClick={() => changeReady()}>
      <Text type={phase === 'ready' ? 'success' : 'danger'}>Ready</Text>
    </Button>
  )
}
