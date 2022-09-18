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

async function checkUp() {
  const info = await getInfo()
  const { roomId, playerId } = info
  if (roomId) {
    removePlayer(roomId, playerId)
    const roomData = await getRoomData(roomId)
    if (!roomData.players) {
      removeRoom(roomId)
    }
  }
  return await clearInfo()
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
