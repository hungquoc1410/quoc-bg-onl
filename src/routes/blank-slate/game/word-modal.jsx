/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Divider, Input, Modal, Progress, Typography } from 'antd'

import { getInfo } from '../../../ultilities/info'
import { setBlankSlatePlayerAnswer } from '../blank-slate'

const { Title } = Typography

export default function WordModal({ wordModal, setWordModal, word }) {
  const [time, setTime] = useState(10)
  const [answer, setAnswer] = useState('')

  const updatePlayerAnswer = async () => {
    setTime(10)
    const info = await getInfo()
    const { roomId, playerId } = info
    await setBlankSlatePlayerAnswer(roomId, playerId, answer)
    setAnswer('')
  }

  useEffect(() => {
    if (wordModal) {
      const timer = setInterval(() => {
        setTime((prev) => prev + 10)
      }, 1000)
      setTimeout(() => {
        clearInterval(timer)
        setWordModal(false)
      }, 10000)
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
      <Progress
        strokeColor={{
          from: '#108ee9',
          to: '#87d068',
        }}
        format={(percent) => (100 - percent) / 10}
        percent={time}
        status='active'
      />
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
