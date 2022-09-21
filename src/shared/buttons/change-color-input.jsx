/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Select } from 'antd'

import { colorsData } from '../../ultilities/colors'
import { updatePlayer } from '../../ultilities/firebase'
import { setInfo } from '../../ultilities/info'

const { Option } = Select

export default function ChangeColorInput({ roomId, playerId, playerColor, homepage }) {
  const [color, setColor] = useState(playerColor)
  const changeColor = async (value) => {
    await setInfo({ playerColor: value })
    if (!homepage) {
      await updatePlayer(roomId, playerId, { color: value })
    }
    return setColor(value)
  }

  return (
    <Select
      key='color'
      defaultValue={playerColor}
      onChange={changeColor}
      style={{ width: '100%', color: color }}
    >
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
