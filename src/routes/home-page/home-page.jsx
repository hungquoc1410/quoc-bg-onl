import React, { useEffect } from 'react'
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth'
import { onDisconnect } from 'firebase/database'
import { Outlet, useLocation } from 'react-router-dom'

import {
  Auth,
  getRoomData,
  removePlayer,
  removeRoom,
  setPlayerRef,
} from '../../ultilities/firebase'
import { clearInfo, getInfo, setInfo } from '../../ultilities/info'
import { checkBlankSlate } from '../blank-slate/blank-slate'

async function checkUp() {
  const info = await getInfo()
  const { roomId, playerId, gameId } = info
  if (roomId) {
    removePlayer(roomId, playerId)
    const roomData = await getRoomData(roomId)
    if (!roomData.players) {
      removeRoom(roomId)
    } else {
      switch (gameId) {
        case 'blankslate':
          checkBlankSlate(roomId)
          break
        default:
          return null
      }
    }
  }
  await clearInfo()
  return null
}

export default function HomePage() {
  const location = useLocation()
  if (location.pathname === '/') {
    checkUp()
  }

  useEffect(() => {
    signInAnonymously(Auth)
    onAuthStateChanged(Auth, async (user) => {
      if (user) {
        setInfo({ playerId: user.uid })
        const info = await getInfo()
        const { roomId, playerId } = info

        if (playerId && roomId) {
          const playerRef = setPlayerRef(roomId, playerId)
          onDisconnect(playerRef).remove()
        }
      }
    })
  })

  return <Outlet />
}
