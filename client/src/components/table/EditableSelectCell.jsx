import React, { useContext, useState, useEffect, useRef } from 'react'
import { Input, Form, Select } from 'antd'
import { EditableContext } from './EditableTable'

const { Option, OptGroup } = Select

const getOptions = (arr) => {
  const groupsObject = arr.reduce((acc, cur) => {
    if (!acc[cur.group]) acc[cur.group] = []
    acc[cur.group].push(<Option value={cur.value} key={cur.value}>{cur.text}</Option>)
    return acc;
  }, {})
  let _options = []
  for (var key in groupsObject) {
    _options.push(<OptGroup label={key} key={key}>{groupsObject[key].map(option => option)}</OptGroup>)
  }
  return _options
}

const EditableSelectCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  options,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext)

  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing((state) => !state)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        name={dataIndex}
        style={{ margin: 0 }}
      >
        <Select
          ref={inputRef}
          onSelect={save}
        // onBlur={save}
        >
          {getOptions(options)}
        </Select>
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

export default EditableSelectCell