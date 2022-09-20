/* eslint-disable react/prop-types */
import React from 'react'
import { Col, Image, Row } from 'antd'

export default function CAHGame({ roomData }) {
  const { currentBlack, currentWhites } = roomData

  return (
    <Row className='w-full' justify='space-between'>
      <Col span={5}>
        {currentBlack && (
          <Image
            src={`/games/cards-against-humanity/black-cards/${currentBlack}`}
            preview={false}
          />
        )}
      </Col>
      <Col span={18}>{currentWhites && 'White Cards'}</Col>
    </Row>
  )
}
