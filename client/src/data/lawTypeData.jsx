import React from 'react';
import { Select as AntSelect } from 'antd';
// data
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

// takes ids & full law type records
// return comma-separated string
export const getLawTypes = (ids, lawTypes) => {
	if (ids && ids.length > 0) {
		return ids.map(id => {
			return lawTypes[id][NAME];
		}).join(', ');
	} else {
		return 'Law type not specified.';
	}
}
