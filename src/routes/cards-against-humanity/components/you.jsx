/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Avatar, Col, Popover, Row, Select, Tooltip, Typography } from 'antd'
import { useParams } from 'react-router-dom'

import { colorsData } from '../../../ultilities/colors'
import { updatePlayer } from '../../../ultilities/firebase'
import { invertColor } from '../../../ultilities/invertColor'

const { Paragraph } = Typography
const { Option } = Select

export default function CAHYou({ data }) {
  const { name, color, id } = data
  const params = useParams()
  const [userSetting, setUserSetting] = useState(false)
  const [yourName, setYourName] = useState(name)

  const changeOpenUserSetting = (newOpen) => {
    setUserSetting(newOpen)
  }

  const changeColor = async (value) => {
    return await updatePlayer(params.roomId, id, { color: value })
  }

  const changeName = async (string) => {
    await updatePlayer(params.roomId, id, { name: string })
    return setYourName(string)
  }

  return (
    <>
      <Row>
        <Col span={6}>
          <div className='flex justify-center items-center cursor-pointer'>
            <Popover
              overlayStyle={{ width: '40vh' }}
              placement='bottomRight'
              content={
                <>
                  <Row>
                    <Paragraph
                      style={{ width: '100%' }}
                      editable={{
                        onChange: changeName,
                        maxLength: 20,
                        triggerType: ['text', 'icon'],
                      }}
                    >
                      {yourName}
                    </Paragraph>
                  </Row>
                  <Row>
                    <Select
                      key='color'
                      defaultValue={color}
                      onChange={changeColor}
                      style={{ width: '100%' }}
                    >
                      {colorsData.map((color) => (
                        <Option
                          key={color.name}
                          value={color.color}
                          style={{ color: color.color, backgroundColor: color.color }}
                        >
                          {color.name}
                        </Option>
                      ))}
                    </Select>
                  </Row>
                </>
              }
              trigger='click'
              open={userSetting}
              onOpenChange={changeOpenUserSetting}
            >
              <Tooltip title='Click to edit name and color' placement='topRight'>
                <Avatar
                  size={64}
                  style={{
                    color: invertColor(color),
                    backgroundColor: color,
                  }}
                >
                  {name[0]}
                </Avatar>
              </Tooltip>
            </Popover>
          </div>
        </Col>
        <Col span={18}>Functions</Col>
      </Row>
    </>
  )
}
