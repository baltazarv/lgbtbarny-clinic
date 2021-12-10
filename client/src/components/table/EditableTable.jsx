import React from 'react'
import { Table, Form } from 'antd'
import EditableSelectCell from './EditableSelectCell'

export const EditableContext = React.createContext(null)

const EditableRow = ({ index, ...props }) => {
	const [form] = Form.useForm()
	return (
		<Form form={form} component={false}>
			<EditableContext.Provider value={form}>
				<tr {...props} />
			</EditableContext.Provider>
		</Form>
	)
}

class EditableTable extends React.Component {

	handleDelete = (key) => {
		const dataSource = [...this.state.dataSource]
		this.setState({
			dataSource: dataSource.filter((item) => item.key !== key),
		})
	}

	render() {
		const {
			columns,
			dataSource,
			handleSave, // editable field
			loading,
			onChange,
			options,
			expandedRowRender,
			pagination = false,
		} = this.props

		const components = {
			body: {
				row: EditableRow,
				cell: EditableSelectCell,
			},
		}

		const _columns = columns.map((col) => {
			if (!col.editable) {
				return col
			}

			return {
				...col,
				onCell: (record) => ({
					record,
					editable: col.editable,
					dataIndex: col.dataIndex,
					title: col.title,
					handleSave,
					options,
				}),
			}
		})

		return (
			<div>
				<Table
					components={components}
					rowClassName={() => 'editable-row'}
					loading={loading}
					dataSource={dataSource}
					columns={_columns}
					options={options}
					pagination={pagination}
					size="small"
					onChange={onChange}
					expandedRowRender={expandedRowRender}
					scroll={{ x: '100%' }}
				/>
			</div>
		)
	}
}

export default EditableTable