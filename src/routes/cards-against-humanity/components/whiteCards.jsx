/* eslint-disable react/prop-types */
import React from 'react'
import { Col, Modal, Row } from 'antd'

export default function MyCards({ open, setOpen, black, whites }) {
  const handleOk = () => {
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
  }

  return (
    <Modal
      style={{
        top: 20,
      }}
      width={'80vw'}
      mask={false}
      title={<div>Draggable Modal</div>}
      open={open}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Row className='w-full' justify='space-between'>
        <Col span={5}>
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
        <Col span={18}>
          <Row className='w-full' justify='space-between'>
            {whites &&
              whites.slice(0, 5).map((white) => {
                return (
                  <Col key={white} span={4}>
                    <div className='w-full flex justify-center items-center overflow-hidden aspect-[492/683] outline outline-2 outline-black'>
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
          <Row className='w-full mt-8' justify='space-between'>
            {whites &&
              whites.slice(5, 10).map((white) => {
                return (
                  <Col key={white} span={4}>
                    <div className='w-full flex justify-center items-center overflow-hidden aspect-[492/683] outline outline-2 outline-black'>
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
