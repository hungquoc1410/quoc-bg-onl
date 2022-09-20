/* eslint-disable react/prop-types */
import React from 'react'
import { Avatar } from 'antd'

import { invertColor } from '../ultilities/invertColor'

export default function PlayerAvatar({ name, color, ready, playing }) {
  const readyColor = ready ? 'rgb(74 222 128)' : 'red'
  const outline = playing ? null : `4px solid ${readyColor}`

  return (
    <Avatar
      size={64}
      style={{
        color: invertColor(color),
        backgroundColor: color,
        outline,
        verticalAlign: 'middle',
      }}
    >
      {name[0]}
    </Avatar>
  )
}
