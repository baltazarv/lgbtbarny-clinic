import React from 'react';
import { Select as AntSelect } from 'antd';
// TODO: move vars from ./peopleFields into this file
// Remove 'Inquirers' and 'Lawyers' table views
import * as peopleFields from './peopleFields';
import { formatName } from './dataTransforms';

export const PEOPLE_TABLE = 'People';
export const INQUIRERS_VIEW = '_Inquirers';
export const LAWYERS_VIEW = '_Lawyers';

const { Option } = AntSelect;

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
