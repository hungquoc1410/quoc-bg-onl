/* eslint-disable react/prop-types */
import React from 'react'

import PlayerAvatar from './avatar'

export default function Others({ playerData, playing }) {
  const { name, phase, color, points } = playerData

  return (
    <PlayerAvatar
      name={name}
      color={color}
      points={points}
      ready={phase === 'ready'}
      playing={playing}
    />
  )
}
