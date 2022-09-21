/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Typography } from 'antd'

import { updatePlayer } from '../../ultilities/firebase'

const { Paragraph } = Typography

export default function ChangeNameInput({ roomId, playerId, playerName }) {
  const [name, setName] = useState(playerName)
  const changeName = async (string) => {
    await updatePlayer(roomId, playerId, { name: string })
    return setName(string)
  }

  return (
    <Paragraph
      style={{ width: '100%' }}
      editable={{
        onChange: changeName,
        maxLength: 20,
        triggerType: ['text', 'icon'],
      }}
    >
      {name}
    </Paragraph>
  )
}
