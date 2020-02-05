import React from 'react';
import { Select as AntSelect } from 'antd';

export const LAW_TYPES_TABLE = 'Type Of Law';
export const NAME = 'Name';

const { Option } = AntSelect;

// works with antd Select
export const getLawTypeOptions = lawTypes => {
	if (lawTypes && lawTypes.length > 0) {
		const options = lawTypes.reduce((_options, item) => {
			const lawType = <Option key={item.id} value={item.id}>{item[NAME]}</Option>
			return [..._options, lawType];
		}, []);
		return options;
	}
}
