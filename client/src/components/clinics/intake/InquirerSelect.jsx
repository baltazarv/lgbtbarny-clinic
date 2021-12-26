import React from 'react'
import { useSelector } from 'react-redux'
import { Select, Button, Tooltip } from 'antd'
import { Form, Row, Col } from 'react-bootstrap'
import { ReloadOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { getOptionsForPeople } from '../../../data/peopleData'

const InquirerSelect = ({
  visitorId,
  setVisitorId,

  // refresh
  onRefresh,
  placeholder,
  loading = false,
}) => {
  const inquirersObject = useSelector((state) => state.people.inquirersObject)

  const field = ({
    controlId,
    label,
    options,
  }) => {
    return <Form.Group
      as={Row}
      controlId={controlId}
      className="mb-2"
    >
      <Form.Label column xs="12" sm="3" md="4" className="small text-muted text-sm-right">{label}</Form.Label>
      <Col xs="9" sm="7" md="6" className="align-self-center">
        <div>
          <Select
            showSearch
            style={{ width: '100%' }}
            placeholder={placeholder}
            loading={loading}
            value={visitorId}
            onChange={(val) => setVisitorId(val)}
            // onBlur={handleBlur}
            optionFilterProp="children"
            allowClear={true}
            autoFocus={true}
          >
            {options}
          </Select>
        </div>
      </Col>
    </Form.Group>
  }

  return (
    <ComponentStyled>
      <div className="d-flex justify-content-center align-items-center mb-2">
        <span className="text-muted">Find an inquirer by name, email address, or phone number:</span>
        <Tooltip title="refresh inquirer info">
          <Button
            shape="circle"
            onClick={onRefresh}
            className="ml-5"
            icon={<ReloadOutlined />}
          />
        </Tooltip>
      </div>
      {field({
        controlId: 'name',
        label: 'by Name:',
        options: getOptionsForPeople(inquirersObject),
      })}
      {field({
        controlId: 'email',
        label: 'by Email:',
        options: getOptionsForPeople(inquirersObject, 'email'),
      })}
      {field({
        controlId: 'phone',
        label: 'by Phone:',
        options: getOptionsForPeople(inquirersObject, 'phone'),
      })}
    </ComponentStyled>
  )
}

const ComponentStyled = styled.div`
  .form-label, .col-form-label {
    font-weight: normal;
  }
  label {
    font-size: 0.9rem;
  }
`

export default InquirerSelect