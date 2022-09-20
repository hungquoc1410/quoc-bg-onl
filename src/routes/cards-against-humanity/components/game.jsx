/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'antd'

import { createArrayFromObject } from '../../../ultilities/createArrayFromObject'
import { updateRoom } from '../../../ultilities/firebase'
import { getInfo } from '../../../ultilities/info'

export default function CAHGame({ roomData }) {
  const { currentBlack, currentWhites, id, confirmWhite } = roomData
  const playersData = createArrayFromObject(roomData.players)
  const [master, setMaster] = useState(false)

  const chooseCard = async (confirmWhite) => {
    if (master) {
      return await updateRoom(id, { confirmWhite })
    }
  }

  useEffect(() => {
    async function setUp() {
      const info = await getInfo()
      const playerId = info.playerId
      setMaster(playersData.filter((player) => player.id === playerId)[0].master)
    }
    setUp()
  }, [roomData])

  return (
    <Row gutter={[0, 16]} className='w-full' justify='space-between'>
      <Col xs={24} lg={5}>
        <Row justify='center'>
          <Col xs={12} lg={24}>
            <div className='w-full h-full flex justify-center items-center overflow-hidden aspect-[492/683]'>
              {currentBlack && (
                <img
                  className='max-w-none aspect-[492/683]'
                  style={{ width: '105%' }}
                  src={`/games/cards-against-humanity/black-cards/${currentBlack}`}
                />
              )}
            </div>
          </Col>
        </Row>
      </Col>
      <Col xs={24} lg={18}>
        <Row className='w-full' justify='center'>
          {currentWhites &&
            currentWhites.map((white) => {
              return (
                <Col
                  key={white}
                  xs={8}
                  lg={4}
                  className={`rounded-md ${white === confirmWhite ? ' ring-8 ring-sky-500' : ''}`}
                  onClick={() => {
                    chooseCard(white)
                  }}
                >
                  <div className='w-full flex justify-center items-center overflow-hidden aspect-[492/683] rounded-md outline outline-2 outline-black'>
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
  )
}
