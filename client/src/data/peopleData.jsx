// TODO: rename as .js vs .jsx

import React from 'react';
import { Select as AntSelect } from 'antd';
// TODO: move vars from ./peopleFields into this file
// Remove 'Inquirers' and 'Lawyers' table views
import * as peopleFields from './peopleFields';
import { objectIsEmpty } from '../utils';

export const PEOPLE_TABLE = 'People';
export const INQUIRERS_VIEW = '_Inquirers';

const { Option } = AntSelect;

// utilities

export const formatName = inquirer => {
	const firstName = inquirer[peopleFields.FIRST_NAME];
	const middleName = inquirer[peopleFields.MIDDLE_NAME];
	const otherNames = inquirer[peopleFields.OTHER_NAMES];
	const lastName = inquirer[peopleFields.LAST_NAME];
	return (firstName ? firstName : '') + (middleName ? ' ' + middleName[0] : '') + ' ' + (lastName ? lastName : '') + (otherNames ? ' "' + otherNames + '"' : '');
}

export const formatNameNoNick = inquirer => {
	const firstName = inquirer[peopleFields.FIRST_NAME];
	const middleName = inquirer[peopleFields.MIDDLE_NAME];
	const lastName = inquirer[peopleFields.LAST_NAME];
	return (firstName ? firstName : '') + (middleName ? ' ' + middleName[0] : '') + ' ' + (lastName ? lastName : '');
}

// given ids and list of full records
// return string separated by commas
export const getPeopleByIds = (ids, people) => {
	return ids.map(id => formatName(people[id])).join(', ');
}

// works with antd Select with people data object
export const getOptionsForPeople = people => {
	const options = [];
	if (!objectIsEmpty(people)) {
		for (var key in people) {
			const fields = people[key];
			if(fields[peopleFields.FIRST_NAME] || fields[peopleFields.LAST_NAME]) {
				options.push(<Option key={key} value={key}>{formatName(fields)}</Option>)
			}
		}
	}
	return options;
}

export const getLawyerNames = (ids, lawyers) => {
	if (ids && ids.length > 0) {
		return ids.map(id => {
			return formatName(lawyers[id]);
		}).join(', ');
	} else {
		return 'Lawyers not specified.';
	}
}
