import React, { useState } from 'react'
import styled from 'styled-components'
import { Card } from 'react-bootstrap'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import EditableTable from '../../table/EditableTable'

const PreviousTable = ({
  title,
  columns,
  dataSource,
  options,
  expandedRowRender,
  isLoading,
  handleSave,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return <>
    {dataSource.length > 0 &&
      <CardStyled
        onClick={() => setIsCollapsed((state) => !state)}
        className={`card p-3 mb-3${isCollapsed ? ' collapsed' : ' expanded'}`}
      >
        <Card.Body className="p-0">
          <Card.Title className="d-flex justify-content-center align-items-center h5 mb-1">{title} {isCollapsed ? <DownOutlined className="ml-2" /> : <UpOutlined className="ml-2" />}</Card.Title>
          {/* should not use Card.Text b/c puts table in a <p> tag, which cause error/warnings */}
          <div className="card-text">{/* Card.Text */}
            {/* <p className="mb-1"><small>If any referrals have been made, visit <a href="https://www.legal.io/" target="_blank" rel="noopener noreferrer">Legal.io</a> to update status below.</small></p> */}

            <EditableTable
              loading={isLoading}
              dataSource={dataSource}
              columns={columns}
              options={options}
              handleSave={handleSave}
              expandedRowRender={expandedRowRender}
            />
          </div>
        </Card.Body>
      </CardStyled>
    }
  </>
}

const CardStyled = styled.div`
	cursor: pointer;

	// icon
	span[role="img"] {
		font-size: 0.8rem;
	}

	&.collapsed .card-text {
		display: none;
	}
`

export default PreviousTable