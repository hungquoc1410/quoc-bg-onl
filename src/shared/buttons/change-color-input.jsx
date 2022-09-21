/* eslint-disable react/prop-types */
import React from 'react'
import { Select } from 'antd'

import { colorsData } from '../../ultilities/colors'
import { updatePlayer } from '../../ultilities/firebase'

const { Option } = Select

export default function ChangeColorInput({ roomId, playerId, playerColor }) {
  const changeColor = async (value) => {
    return await updatePlayer(roomId, playerId, { color: value })
  }

  return (
    <Select key='color' defaultValue={playerColor} onChange={changeColor} style={{ width: '100%' }}>
      {colorsData.map((color) => (
        <Option
          key={color.name}
          value={color.color}
          style={{ color: color.color, backgroundColor: color.color }}
        >
          {color.name}
        </Option>
      ))}
    </Select>
  )
}
