import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
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
import FormModal from '../../modals/FormModal'
import AddUpdateInquiry from '../intake/AddUpdateInquiry'
// constants
import * as consultFields from '../../../data/consultFields'
// utils/actions
import { getDispoLongNames } from '../../../data/consultationData'
import {
  updateConsultation,
  deleteConsultation,
  consultationDeleted,
} from '../../../store/actions'
import { formatName } from '../../../data/peopleData'

const PreviousTable = ({
  title,
  info,
  columns,
  dataSource,
  options,
  expandedRowRender,
  isLoading,
  setIsLoading,

  // create, update, delete
  hasActions,
  inquirer,
}) => {
  const dispatch = useDispatch()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [rowModalIsOpen, setRowModalIsOpen] = useState(false)
  const [rowModalKey, setRowModalKey] = useState(null)

  // update consultFields.DISPOSITIONS or consultFields.STATUS
  const updateField = (tableRow) => {
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

    dispatch(updateConsultation(updateObject))
    //-> dispatch(consultationUpdated(newConsultation))
  }

  const openAddRowModal = () => {
    setRowModalKey(null)
    setRowModalIsOpen(true)
  }

  const openUpdateRowModal = (key) => {
    setRowModalKey(key)
    setRowModalIsOpen(true)
  }

  const deleteRow = async (key) => {
    const res = await dispatch(deleteConsultation(key))
    if (res.status === 'success') {
      // remove from consultations local object
      // ...not removing from inquriers local object
      dispatch(consultationDeleted(res.payload.id))
    }
  }

  /** RENDERER */

  // show create, update, and delete buttons
  if (hasActions && columns?.length) {
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
              onClick={() => openUpdateRowModal(record.key)}
              size="small"
              icon={<EditOutlined />}
            />
            <Popconfirm
              title="Delete record?"
              icon={<ExclamationCircleOutlined
                style={{ color: 'red' }}
              />}
              okType="danger"
              okText="Delete"
              onConfirm={() => deleteRow(record.key)}
            >
              <Button
                type="danger"
                className="delete-btn"
                ghost
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
      <>
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
            {hasActions &&
              <Button
                type="primary"
                className="add-btn m-3"
                onClick={openAddRowModal}
                size="small"
                icon={<PlusOutlined />}
              />
            }
          </Card.Body>
        </CardStyled>
        <FormModal
          show={rowModalIsOpen}
          onHide={() => setRowModalIsOpen(false)}
          header={`${rowModalKey ? 'Update Inquiry' : 'Add Inquiry'}${inquirer ? ` from ${formatName(inquirer)}` : ''}`}
          body={<AddUpdateInquiry
            inquirer={inquirer} // need id
            onHide={() => setRowModalIsOpen(false)}
            isSubmitting={isLoading}
            setIsSubmitting={setIsLoading}
            updateData={dataSource?.find((row) => rowModalKey === row.key)}
          />}
          size="lg"
        />
      </>
    }
  </>
}

const CardStyled = styled.div`
	cursor: pointer;
  position: relative;

  .card-text {
    cursor: auto;
  }

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