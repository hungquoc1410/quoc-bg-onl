/* eslint-disable react/prop-types */
import React from 'react'
import { Avatar, Badge, Col, Popover, Row, Tooltip } from 'antd'
import { useParams } from 'react-router-dom'

import { invertColor } from '../../ultilities/invertColor'
import ChangeColorInput from '../buttons/change-color-input'
import ChangeNameInput from '../buttons/change-name-input'

export default function You({ playerId, name, color, points, userSetting, handleOpenChange }) {
  const params = useParams()

  return (
    <Col span={6}>
      <div className='flex justify-center items-center w-full h-full cursor-pointer'>
        <Popover
          overlayStyle={{ width: '20vw' }}
          placement='bottomRight'
          content={
            <div>
              <Row>
                <ChangeNameInput
                  roomId={params.roomId}
                  playerId={playerId}
                  playerName={name}
                ></ChangeNameInput>
              </Row>
              <Row>
                <ChangeColorInput roomId={params.roomId} playerId={playerId} playerColor={color} />
              </Row>
            </div>
          }
          trigger='click'
          open={userSetting}
          onOpenChange={handleOpenChange}
        >
          <Tooltip title='Click to edit name and color' placement='topRight'>
            <Badge
              count={points}
              color={invertColor(color, false)}
              style={{ color: invertColor(invertColor(color, false), true) }}
            >
              <Avatar
                size={64}
                style={{
                  color: invertColor(color, true),
                  backgroundColor: color,
                  verticalAlign: 'middle',
                }}
              >
                {name[0]}
              </Avatar>
            </Badge>
          </Tooltip>
        </Popover>
      </div>
    </Col>
  )
}
