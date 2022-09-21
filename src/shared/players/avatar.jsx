/* eslint-disable react/prop-types */
import React from 'react'
import { Avatar, Badge } from 'antd'

import { invertColor } from '../../ultilities/invertColor'

export default function PlayerAvatar({ name, color, points, ready, playing }) {
  const readyColor = ready ? 'rgb(74 222 128)' : 'red'
  const outline = playing ? null : `4px solid ${readyColor}`

  return (
    <Badge
      count={points}
      color={invertColor(color, false)}
      style={{ color: invertColor(invertColor(color, false), true) }}
    >
      <Avatar
        size={64}
        style={{
          color: invertColor(color, true),
          backgroundColor: color,
          outline,
          verticalAlign: 'middle',
        }}
      >
        {name[0]}
      </Avatar>
    </Badge>
  )
}
