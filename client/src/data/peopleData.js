import React from 'react';
import { Select as AntSelect } from 'antd';
// TODO: move vars from ./peopleFields into this file
// Remove 'Inquirers' and 'Lawyers' table views
import * as peopleFields from './peopleFields';

export const PEOPLE_TABLE = 'People';
export const INQUIRERS_VIEW = '_Inquirers';
export const LAWYERS_VIEW = '_Lawyers';

const { Option } = AntSelect;

// utilities

export const formatName = inquirer => {
	const firstName = inquirer[peopleFields.FIRST_NAME];
	const middleName = inquirer[peopleFields.MIDDLE_NAME];
	const otherNames = inquirer[peopleFields.OTHER_NAMES];
	const lastName = inquirer[peopleFields.LAST_NAME];
	return (firstName ? firstName : '') + (middleName ? ' ' + middleName[0] : '') + ' ' + (lastName ? lastName : '') + (otherNames ? ' "' + otherNames + '"' : '');
}

// given ids and list of full records
// return string separated by commas
export const getPeopleByIds = (ids, people) => {
	return ids.map(id => formatName(people[id])).join(', ');
}

// format data from people table into react-select options
export const getPeopleIntoSelectOptions = (arr) => {
	return arr.reduce((options, item) => {
		if (item[peopleFields.FIRST_NAME] || item[peopleFields.LAST_NAME]) {
			const inqObj = {
				value: item.id,
				label: formatName(item),
			}
			return [...options, inqObj]
		} else {
			return options;
		}
	}, []);
}

// works with antd Select
export const getPeopleOptions = people => {
	// console.log('getPeopleOptions', people);
	if (people && people.length > 0) {
		const options = people.reduce((_options, item) => {
			if (item[peopleFields.FIRST_NAME] || item[peopleFields.LAST_NAME]) {
				const inqObj = <Option key={item.id} value={item.id}>{formatName(item)}</Option>
				return [..._options, inqObj];
			}
			else {
				return _options;
			}
		}, []);
		// console.log('getPeopleOptions options', options)
		return options;
	}
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
