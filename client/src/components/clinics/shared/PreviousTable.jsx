import React, { useState } from 'react'
import styled from 'styled-components'
import { Card } from 'react-bootstrap'
import { Button, Popconfirm } from 'antd'
import {
  DownOutlined,
  UpOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import EditableTable from '../../table/EditableTable'
// constants
import * as consultFields from '../../../data/consultFields'
import { getDispoLongNames } from '../../../data/consultationData'

const PreviousTable = ({
  title,
  info,
  columns,
  dataSource,
  options,
  expandedRowRender,
  isLoading,

  updateConsultation,
  deleteConsultation,
  setDataSource,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  // update consultFields.DISPOSITIONS or consultFields.STATUS
  const updateField = (tableRow) => {
    // (1) update table
    const newData = [...dataSource]
    const index = newData.findIndex(item => tableRow.key === item.key)
    const item = newData[index]
    newData.splice(index, 1, {
      ...item,
      ...tableRow,
    })
    setDataSource(newData)

    // (2) update db >> (3) update redux state
    let fields = {}
    // update disposition/"last response"
    if (tableRow[consultFields.DISPOSITIONS]) {
      // not sure why sometime string and other times an array
      let val = tableRow[consultFields.DISPOSITIONS]
      if (Array.isArray(tableRow[consultFields.DISPOSITIONS]) && tableRow[consultFields.DISPOSITIONS]?.length > 0) {
        val = tableRow[consultFields.DISPOSITIONS][0]
      }
      val = getDispoLongNames(val)
      fields[consultFields.DISPOSITIONS] = [val]
    }
    // update status
    // ...always a string
    if (tableRow[consultFields.STATUS]) {
      fields[consultFields.STATUS] = tableRow[consultFields.STATUS]
    }
    const updateObject = {
      id: tableRow.key,
      fields,
    }

    updateConsultation(updateObject)
  }

  const addRow = () => {
    console.log('addRow')
  }

  const updateRow = (key) => {
    console.log('updateRow', key)
  }

  const deleteRow = async (key) => {
    const res = await deleteConsultation(key)
    // remove from local state
    if (res.status === 'success') {
      const deletedRecord = res.payload
      let data = dataSource.reduce((acc, row) => {
        if (row.key !== deletedRecord.id) acc.push(row)
        return acc
      }, [])
      setDataSource(data)
    }
  }

  // show create, update, and delete buttons if parent sends those CRUD operations
  if (columns?.length && updateConsultation && deleteConsultation && setDataSource) {
    columns = [...columns]
    columns.push({
      title: 'actions',
      key: 'actions',
      render: (record) => {
        if (dataSource.length > 0) {
          return <>
            <Button
              type="primary"
              className="edit-btn mr-2 mb-2 mb-md-0"
              ghost
              onClick={() => updateRow(record.key)}
              size="small"
              icon={<EditOutlined />}
            />
            <Popconfirm
              title="Delete record?"
              // title={null}
              icon={<ExclamationCircleOutlined
                style={{ color: 'red' }}
              />}
              // icon={null}
              okType="danger"
              okText="Delete"
              onConfirm={() => deleteRow(record.key)}
            >
              <Button
                type="danger"
                className="delete-btn"
                ghost
                // onClick={addRow}
                size="small"
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </>
        } else {
          return null
        }
      },
    })
  }

  return <>
    {dataSource.length > 0 &&
      <CardStyled
        className={`card p-3 mb-3${isCollapsed ? ' collapsed' : ' expanded'}`}
      >
        <Card.Body className="p-0">
          <Card.Title
            onClick={() => setIsCollapsed((state) => !state)}
            className="d-flex justify-content-center align-items-center h5 mb-1"
          >{title} {isCollapsed ? <DownOutlined className="ml-2" /> : <UpOutlined className="ml-2" />}</Card.Title>
          {/* should not use Card.Text b/c puts table in a <p> tag, which cause error/warnings */}
          <div className="card-text">{/* Card.Text */}
            {info}
            <EditableTable
              loading={isLoading}
              dataSource={dataSource}
              columns={columns}
              options={options}
              handleSave={updateField}
              expandedRowRender={expandedRowRender}
            />
          </div>
          {addRow &&
            <Button
              type="primary"
              className="add-btn m-3"
              onClick={addRow}
              size="small"
              icon={<PlusOutlined />}
            />
          }
        </Card.Body>
      </CardStyled>
    }
  </>
}

const CardStyled = styled.div`
	cursor: pointer;
  position: relative;

	// icon
	span[role="img"] {
		font-size: 0.8rem;
	}

	&.collapsed .card-text {
		display: none;
	}

  .add-btn {
    position: absolute;
    top: 0;
    right: 0;
  }

  .ant-popover-message {
    display: none;
  }
`

export default PreviousTable