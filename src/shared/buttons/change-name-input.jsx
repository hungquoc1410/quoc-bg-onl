/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Input } from 'antd'

import { updatePlayer } from '../../ultilities/firebase'
import { setInfo } from '../../ultilities/info'

export default function ChangeNameInput({ roomId, playerId, playerName, homepage }) {
  const [name, setName] = useState(playerName)
  const changeName = async (e) => {
    const newName = e.target.value
    await setInfo({ playerName: newName })
    if (!homepage) {
      await updatePlayer(roomId, playerId, { name: newName })
    }
    return setName(newName)
  }

  return (
    <Input
      style={{ width: '100%' }}
      onChange={changeName}
      defaultValue={name}
      value={name}
      placeholder='Your Name'
    />
  )
}
