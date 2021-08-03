import React from 'react';
import { Select as AntSelect } from 'antd';
// data
import { objectIsEmpty } from '../utils';
export const LAW_TYPES_TABLE = 'Type Of Law';
export const NAME = 'Name';

const { Option } = AntSelect;

// works with antd Select with law types data object
export const getOptionsForLawTypes = lawTypes => {
	const options = [];
	if (!objectIsEmpty(lawTypes)) {
		for (var key in lawTypes) {
			const fields = lawTypes[key];
			options.push(<Option key={key} value={key}>{fields[NAME]}</Option>)
		}
	}
	return options;
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
