/* eslint-disable react/prop-types */
import React from 'react'

import PlayerAvatar from '../../../shared/avatar'

export default function CAHOthers({ playerData, playing }) {
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
