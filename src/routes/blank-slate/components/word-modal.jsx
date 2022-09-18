/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Divider, Input, Modal, Typography } from 'antd'

import { updatePlayer } from '../../../ultilities/firebase'
import { getInfo } from '../../../ultilities/info'

const { Title } = Typography

export default function WordModal({ wordModal, setWordModal, word }) {
  const [time, setTime] = useState(15)
  const [answer, setAnswer] = useState('')

  const updatePlayerAnswer = async () => {
    setTime(15)
    const info = await getInfo()
    const { roomId, playerId } = info
    await updatePlayer(roomId, playerId, { phase: 'answered', answer: answer.toUpperCase() })
    setAnswer('')
  }

  useEffect(() => {
    if (wordModal) {
      const timer = setInterval(() => {
        setTime((prev) => prev - 1)
      }, 1000)
      setTimeout(() => {
        clearInterval(timer)
        setWordModal(false)
      }, 15000)
    }
  }, [wordModal])

  return (
    <Modal
      footer={null}
      keyboard={false}
      maskClosable={false}
      title='Insert Your Answer!'
      closable={false}
      open={wordModal}
      afterClose={updatePlayerAnswer}
    >
      <Title style={{ textAlign: 'center', color: 'red' }}>{time}</Title>
      <Divider />
      <Title style={{ textAlign: 'center' }}>{word}</Title>
      <Input
        size='large'
        placeholder='One Word Only!'
        value={answer}
        onChange={(e) => {
          setAnswer(e.target.value)
        }}
      />
    </Modal>
  )
}
