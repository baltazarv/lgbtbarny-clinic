import React from 'react';
import { Table, Form, Select } from 'antd';

const { Option } = Select;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
	<EditableContext.Provider value={form}>
		<tr {...props} />
	</EditableContext.Provider>
);

const getOptions = arr => {
	return arr.map(item => {
		return <Option key={item} value={item}>{item}</Option>
	})
}

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
	state = {
		editing: false,
	};

	toggleEdit = () => {
		const editing = !this.state.editing;
		this.setState({ editing }, () => {
			if (editing) {
				this.input.focus();
			}
		});
	};

	save = e => {
		const { record, handleSave } = this.props;
		this.form.validateFields((error, values) => {
			if (error && error[e.currentTarget.id]) {
				return;
			}
			this.toggleEdit();
			handleSave({ ...record, ...values });
		});
	};

	renderCell = form => {
		this.form = form;
		const { children, dataIndex, record, statuses } = this.props;
		const { editing } = this.state;
		return editing ? (
			<Form.Item style={{ margin: 0 }}>
				{form.getFieldDecorator(dataIndex, {
					// no rules since pulldown menu
					initialValue: record[dataIndex],
				})(<Select
					ref={node => (this.input = node)}
					onPressEnter={this.save}
					onSelect={this.save}
				>
					{getOptions(statuses)}
				</Select>)}
			</Form.Item>
		) : (
				<div
					className="editable-cell-value-wrap"
					// style={{ paddingRight: 24 }}
					onClick={this.toggleEdit}
				>
					{children}
				</div>
			);
	};

	render() {
		const {
			editable,
			dataIndex,
			title,
			record,
			index,
			handleSave,
			children,
			...restProps
		} = this.props;
		return (
			<td {...restProps}>
				{editable ? (
					<EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
				) : (
						children
					)}
			</td>
		);
	}
}

class EditableTable extends React.Component {

	render() {
		// parent ReferralsTable props
		const {
			columns,
			dataSource,
			handleSave,
			loading,
			onChange,
			statuses,
			expandedRowRender,
		} = this.props;

		const components = {
			body: {
				row: EditableFormRow,
				cell: EditableCell,
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
					statuses: statuses,
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
					statuses={statuses}
					pagination={false}
					size="small"
					onChange={onChange}
					expandedRowRender={expandedRowRender}
				/>
			</div>
		);
	}
}

export default EditableTable;