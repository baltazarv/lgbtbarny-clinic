import React from 'react';
import { Table } from 'antd';

const ExpandedRowTable = () => {
	return (
		<Table />
	)
}

const ReferConsultTable = props => {

	const handleTableChange = (pagination, filters, sorter) => {
		console.log('pagination', pagination, 'filters', filters, 'sorter', sorter)
	};

	return (
		<>
			<Table
				columns={props.columns}
				rowKey={record => record.key}
				dataSource={props.data}
				pagination={false}
				onChange={handleTableChange}
				loading={props.isLoading}
				size="middle"
				expandedRowRender={ExpandedRowTable}
			/>
		</>
	)
};

export default ReferConsultTable;
