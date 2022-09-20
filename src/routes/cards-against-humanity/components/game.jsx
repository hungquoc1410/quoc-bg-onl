/* eslint-disable react/prop-types */
import React from 'react'
import { Col, Row } from 'antd'

export default function CAHGame({ roomData }) {
  const { currentBlack, currentWhites } = roomData

  return (
    <Row className='w-full' justify='space-between'>
      <Col span={5}>
        <div className='w-full flex justify-center items-center'>
          {currentBlack && (
            <img src={`/games/cards-against-humanity/black-cards/${currentBlack}`} />
          )}
        </div>
      </Col>
      <Col span={18}>{currentWhites && 'White Cards'}</Col>
    </Row>
  )
}
