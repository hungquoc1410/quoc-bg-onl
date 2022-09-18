import React from 'react'
import { Button, Result } from 'antd'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Winner() {
  const { state } = useLocation()
  const navigate = useNavigate()
  let title
  if (state.name.length > 1) {
    title = 'The winner are' + ' ' + state.name.join(', ')
  } else {
    title = 'The winner is' + ' ' + state.name[0]
  }

  return (
    <Result
      status='success'
      title={title}
      extra={[
        <Button
          type='primary'
          key='homepage'
          onClick={() => {
            navigate('/')
          }}
        >
          Go back to Homepage
        </Button>,
      ]}
    />
  )
}
