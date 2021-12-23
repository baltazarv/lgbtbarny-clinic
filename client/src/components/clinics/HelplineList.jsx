/** - from Clinic Intake on "processed contact" */

import React from 'react';
import { List, Typography } from 'antd';
// data
import * as consultFields from '../../data/consultFields';
import { getPeopleByIds } from '../../data/peopleData';
import { getLawTypes } from '../../data/lawTypeData';

const HelplineList = props => {
	const {
		inquiry,
		lawyers,
		lawTypes,
	} = props;

	const key = inquiry.key;

	let consultLawyers = 'Clinic coordinator not specified.';
	if (inquiry[consultFields.COORDINATOR]) {
		consultLawyers = getPeopleByIds(inquiry[consultFields.COORDINATOR], lawyers);
	}

	let dataSource = [
		{
			title: "Contact Type", // Type
			value: inquiry[consultFields.TYPE] ? inquiry[consultFields.TYPE] : "No contact type recorded.",
			className: 'd-md-none',
		},
		{
			title: 'Coordinator',
			value: consultLawyers,
		},
		{
			title: "Legal issue(s)", // Type Of Law
			value: getLawTypes(inquiry[consultFields.LAW_TYPES], lawTypes),
		},
		{
			title: "Notes", // Inquirer's Situation
			value: inquiry[consultFields.SITUATION] ? inquiry[consultFields.SITUATION] : "No notes taken.",
		},
	]

	return (
		<>
			<List
				bordered={false}
				itemLayout="horizontal"
				dataSource={dataSource}
				size="small"
				renderItem={item => {
					const moreProps = {}
					if (item.className) moreProps.className = item.className
					return (
						<List.Item
							key={`${key}_${item.title}`}
							size="small"
							{...moreProps}
						>
							<Typography.Text code>{item.title}</Typography.Text> {item.value}
						</List.Item>
					)
				}}
			/>
		</>
	)
}

export default HelplineList;
