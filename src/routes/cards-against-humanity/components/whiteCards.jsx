/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Col, message, Modal, Row } from 'antd'
import _ from 'underscore'

import { updatePlayer } from '../../../ultilities/firebase'

export default function MyCards({ open, setOpen, black, whites, roomId, playerId }) {
  const [chose, setChose] = useState('')

  const handleOk = async () => {
    if (chose) {
      const remainingCards = _.difference(whites, [chose])
      await updatePlayer(roomId, playerId, {
        currentWhite: chose,
        cards: remainingCards,
        phase: 'submitted',
      })
      return setOpen(false)
    } else {
      return message.error('You must choose a card!')
    }
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Modal
      style={{
        top: 20,
      }}
      width={'90vw'}
      mask={false}
      title={<div>Choose Your Card!</div>}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Row gutter={[0, 16]} className='w-full' justify='space-between'>
        <Col xs={24} lg={5}>
          <Row justify='center'>
            <Col xs={16} lg={24}>
              <div className='w-full h-full flex justify-center items-center overflow-hidden aspect-[492/683]'>
                {black && (
                  <img
                    className='max-w-none aspect-[492/683]'
                    style={{ width: '105%' }}
                    src={`/games/cards-against-humanity/black-cards/${black}`}
                    alt='black-card'
                  />
                )}
              </div>
            </Col>
          </Row>
        </Col>
        <Col xs={24} lg={18}>
          <Row className='w-full lg:!justify-center lg:!gap-4' justify='space-evenly' gutter={[0, 16]}>
            {whites &&
              whites.map((white) => {
                return (
                  <Col
                    key={white}
                    xs={10}
                    lg={4}
                    className={`rounded-md ${white === chose ? 'ring-8 ring-sky-500' : ''}`}
                    onClick={() => {
                      setChose(white)
                    }}
                  >
                    <div className='w-full h-full flex justify-center items-center overflow-hidden aspect-[492/683] rounded-md outline outline-2 outline-black'>
                      <img
                        className='max-w-none aspect-[492/683]'
                        style={{ width: '105%' }}
                        alt='white-card'
                        src={`/games/cards-against-humanity/white-cards/${white}`}
                      />
                    </div>
                  </Col>
                )
              })}
          </Row>
        </Col>
      </Row>
    </Modal>
  )
}
