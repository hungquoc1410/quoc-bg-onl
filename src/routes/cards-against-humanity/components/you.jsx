/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Avatar, Col, Popover, Row, Space, Tooltip } from 'antd'
import { useParams } from 'react-router-dom'

import ChangeColorInput from '../../../shared/change-color-input'
import ChangeNameInput from '../../../shared/change-name-input'
import ReadyButton from '../../../shared/ready-button'
import StartButton from '../../../shared/start-button'
import { invertColor } from '../../../ultilities/invertColor'

export default function CAHYou({ roomData, playerData, playing }) {
  const { name, color, id, master, phase } = playerData
  const params = useParams()
  const [userSetting, setUserSetting] = useState(false)

  const handleOpenChange = (newOpen) => {
    setUserSetting(newOpen)
  }

  const functions = () => {
    switch (master) {
      case true: {
        switch (playing) {
          case true:
            break
          default:
            return (
              <>
                <StartButton roomData={roomData} />
                <ReadyButton phase={phase} roomId={params.roomId} playerId={id} />
              </>
            )
        }
        break
      }
      default: {
        switch (playing) {
          case true:
            break
          default:
            return <ReadyButton phase={phase} roomId={params.roomId} playerId={id} />
        }
        break
      }
    }
  }

  return (
    <>
      <Row>
        <Col span={6}>
          <div className='flex justify-center items-center w-full h-full cursor-pointer'>
            <Popover
              overlayStyle={{ width: '40vh' }}
              placement='bottomRight'
              content={
                <div>
                  <Row>
                    <ChangeNameInput
                      roomId={params.roomId}
                      playerId={id}
                      playerName={name}
                    ></ChangeNameInput>
                  </Row>
                  <Row>
                    <ChangeColorInput roomId={params.roomId} playerId={id} playerColor={color} />
                  </Row>
                </div>
              }
              trigger='click'
              open={userSetting}
              onOpenChange={handleOpenChange}
            >
              <Tooltip title='Click to edit name and color' placement='topRight'>
                <Avatar
                  size={64}
                  style={{
                    color: invertColor(color),
                    backgroundColor: color,
                    verticalAlign: 'middle',
                  }}
                >
                  {name[0]}
                </Avatar>
              </Tooltip>
            </Popover>
          </div>
        </Col>
        <Col span={18}>
          <div className='flex justify-center items-center w-full h-full'>
            <Space>{functions()}</Space>
          </div>
        </Col>
      </Row>
    </>
  )
}
