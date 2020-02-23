import React from 'react';
import { Form, Select } from 'antd';
import { EditableContext } from './EditableTable'

const { Option } = Select;


const getOptions = arr => {
	return arr.map(item => {
		return <Option key={item} value={item}>{item}</Option>
	})
}

class EditableSelectCell extends React.Component {
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
		const { children, dataIndex, record, options } = this.props;
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
					{getOptions(options)}
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

export default EditableSelectCell;
