import React from 'react';
import { Table, Form } from 'antd';

import EditableSelectCell from './EditableSelectCell';

export const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
	<EditableContext.Provider value={form}>
		<tr {...props} />
	</EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableTable extends React.Component {

	render() {
		const {
			columns,
			dataSource,
			handleSave,
			loading,
			onChange,
			options,
			expandedRowRender,
			pagination = false,
		} = this.props;

		const components = {
			body: {
				row: EditableFormRow,
				cell: EditableSelectCell,
			},
		};
		const _columns = columns.map(col => {
			if (!col.editable) {
				return col;
			}
			return {
				...col,
				onCell: record => ({
					record,
					editable: col.editable,
					dataIndex: col.dataIndex,
					title: col.title,
					handleSave,
					options,
				}),
			};
		});
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
		);
	}
}

export default EditableTable;
