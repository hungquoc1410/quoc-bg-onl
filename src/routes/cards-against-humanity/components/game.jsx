/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'antd'

import { createArrayFromObject } from '../../../ultilities/createArrayFromObject'
import { updateRoom } from '../../../ultilities/firebase'
import { getInfo } from '../../../ultilities/info'

import BlackCard from './black-card'

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
      <BlackCard black={currentBlack} />
      <Col xs={24} lg={18}>
        <Row
          className='w-full lg:!justify-center lg:!gap-4'
          justify='space-evenly'
          gutter={[0, 16]}
        >
          {currentWhites &&
            currentWhites.map((white) => {
              return (
                <Col
                  key={white}
                  xs={8}
                  lg={4}
                  className={`rounded-md ${white === confirmWhite ? 'lg:ring-8 ring-4 ring-sky-500' : ''}`}
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
