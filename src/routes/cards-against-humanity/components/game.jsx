/* eslint-disable react/prop-types */
import React from 'react'
import { Col, Row } from 'antd'

export default function CAHGame({ roomData }) {
  const { currentBlack, currentWhites } = roomData

  return (
    <Row className='w-full' justify='space-between'>
      <Col span={5}>
        <div className='w-full flex justify-center items-center overflow-hidden aspect-[492/683]'>
          {currentBlack && (
            <img
              className='max-w-none aspect-[492/683]'
              style={{ width: '105%' }}
              src={`/games/cards-against-humanity/black-cards/${currentBlack}`}
            />
          )}
        </div>
      </Col>
      <Col span={18}>{currentWhites && 'White Cards'}</Col>
    </Row>
  )
}
