import React from 'react'
import { Button, Result } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

import BlankSlateWinner from '../routes/blank-slate/components/winner-data'

export default function Winner() {
  const { state } = useLocation()
  const { name, gameId, data } = state
  const navigate = useNavigate()
  let title
  if (name.length > 1) {
    title = 'The winner are' + ' ' + name.join(', ')
  } else {
    title = 'The winner is' + ' ' + name[0]
  }

  const winnerPage = () => {
    switch (gameId) {
      case 'blankslate':
        return <BlankSlateWinner data={data} />
    }
  }
  return (
    <>
      <Result
        status='success'
        title={title}
        extra={[
          <Button
            type='primary'
            key='homepage'
            onClick={() => {
              navigate(-1)
            }}
          >
            Back to Room!
          </Button>,
        ]}
      />
      {winnerPage()}
    </>
  )
}
