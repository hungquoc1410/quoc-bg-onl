import React from 'react'
import { message } from 'antd'
import { onValue, ref } from 'firebase/database'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import BlankSlateIndex from './routes/blank-slate'
import CAHIndex from './routes/cards-against-humanity'
import HomePageIndex from './routes/home-page'
import HomePage from './routes/home-page/home-page'
import ErrorPage from './shared/error-page'
import RoomPage from './shared/room-page'
import { Database } from './ultilities/firebase'

import './index.css'
import 'antd/dist/antd.min.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePageIndex /> },
      {
        path: ':roomId',
        element: <RoomPage />,
        errorElement: <ErrorPage />,
        children: [
          { path: 'blankslate', element: <BlankSlateIndex /> },
          { path: 'cah', element: <CAHIndex /> },
        ],
      },
    ],
  },
])

const connectedRef = ref(Database, '.info/connected')
const key = 'updatable'

onValue(connectedRef, (snapshot) => {
  if (snapshot.val() === true) {
    message.success({
      content: 'You are connected!',
      key,
      duration: 1,
    })
  } else {
    message.loading({
      content: 'Loading...',
      key,
    })
  }
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<RouterProvider router={router} />)
