/* eslint-disable react/prop-types */
import React from 'react'
import { Col, Row } from 'antd'

export default function BlackCard({ black }) {
  return (
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
  )
}
