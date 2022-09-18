import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { get, getDatabase, query, ref, set, update } from 'firebase/database'

import { createArrayFromObject } from './createArrayFromObject'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAeovPxG6D-VJbZRsW50t2uadkEDSO7Mlk',
  authDomain: 'chinatown-online.firebaseapp.com',
  databaseURL: 'https://chinatown-online-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'chinatown-online',
  storageBucket: 'chinatown-online.appspot.com',
  messagingSenderId: '181622129939',
  appId: '1:181622129939:web:d9712dd69b8c035ea286e6',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const Auth = getAuth(app)

// Initialize Realtime Database and get a reference to the service
export const Database = getDatabase(app)
export const DatabaseRef = ref(Database)

// Set ref
export const setRoomRef = (roomId) => {
  return ref(Database, `rooms/${roomId}`)
}

export const setPlayerRef = (roomId, playerId) => {
  return ref(Database, `rooms/${roomId}/players/${playerId}`)
}

// Get data
export const getRoomsData = async () => {
  const snapshot = await get(query(ref(Database, 'rooms')))
  return snapshot.val()
}

export const getRoomData = async (roomId) => {
  const roomRef = setRoomRef(roomId)
  const snapshot = await get(query(roomRef))
  return snapshot.val()
}

// Create data
export const createRoom = async (roomId, data) => {
  const roomRef = setRoomRef(roomId)
  return await set(roomRef, data)
}

export const createPlayer = async (roomId, playerId, data) => {
  const playerRef = setPlayerRef(roomId, playerId)
  return await set(playerRef, data)
}

// Remove data
export const removeRoom = (roomId) => {
  const roomRef = setRoomRef(roomId)
  set(roomRef, null)
}

export const removePlayer = (roomId, playerId) => {
  const playerRef = setPlayerRef(roomId, playerId)
  set(playerRef, null)
}

// Check data
export const checkRoom = (roomData) => {
  const playersData = createArrayFromObject(roomData.players)
  const numOfPlayers = playersData.length
  const result = playersData.map((player) => player.master).includes(true)
  if (!result) {
    updatePlayer(roomData.id, playersData[0].id, { master: true })
  }
  return updateRoom(roomData.id, { numOfPlayers: numOfPlayers })
}

// Update data
export const updatePlayer = (roomId, playerId, data) => {
  const playerRef = setPlayerRef(roomId, playerId)
  return update(playerRef, data)
}

export const updateRoom = (roomId, data) => {
  const roomRef = setRoomRef(roomId)
  return update(roomRef, data)
}
