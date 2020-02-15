import React from 'react';
import { List, Typography, Tag } from 'antd';
// import { Button, Modal } from 'react-bootstrap';
// data
import * as consultFields from '../data/consultionFields';
import { getPeopleByIds } from '../data/peopleData';
import { getLawTypes } from '../data/lawTypeData';
import { formatName } from '../data/peopleData'

const ConsultationDetails = props => {
	// props from InquirerDetails parent
	const {
		consultSelected,
		lawyers,
		lawTypes,
	} = props;

	const {
		id,
	} = consultSelected;

	let consultLawyers = 'Consulting lawyer not specified.';
	if (consultSelected.fields[consultFields.LAWYERS]) {
		consultLawyers = getPeopleByIds(consultSelected.fields[consultFields.LAWYERS], lawyers);
	}
	let dataSource = [
		{
			title: 'Lawyer(s)',
			value: consultLawyers,
		},
		{
			title: "Consultation Notes",
			value: consultSelected.fields[consultFields.SITUATION] ? consultSelected.fields[consultFields.SITUATION] : "No notes taken."
		},
		{
			title: consultFields.DISPOSITIONS,
			key: consultFields.DISPOSITIONS,
			value: consultSelected.fields[consultFields.DISPOSITIONS] ? consultSelected.fields[consultFields.DISPOSITIONS] : "No notes taken."
		},
	]

	let referralData = [
		{
			title: "Type(s) of Law",
			value: getLawTypes(consultSelected.fields[consultFields.LAW_TYPES], lawTypes),
		},
		{
			title: consultFields.REF_SUMMARY,
			value: consultSelected.fields[consultFields.REF_SUMMARY] ? consultSelected.fields[consultFields.REF_SUMMARY] : 'No summary written.',
		},
	];

	const hasEligible = _dispos => {
		return _dispos.some(dispo => {
			if (dispo === consultFields.DISPOSITIONS_FEE_BASED) return true;
			if (dispo === consultFields.DISPOSITIONS_PRO_BONO) return true;
			if (dispo === consultFields.DISPOSITIONS_COMPELLING) return true;
			return false;
		})
	}

	if (hasEligible(consultSelected.fields[consultFields.DISPOSITIONS])) {
		dataSource = [...dataSource, ...referralData];
	}

	if (consultSelected.fields[consultFields.EMAIL_TEXT_SENT]) {
		dataSource.push({
			title: consultFields.EMAIL_TEXT_SENT,
			value: consultSelected.fields[consultFields.EMAIL_TEXT_SENT],
		})
	}

	if (consultSelected.fields[consultFields.STATUS]) {
		dataSource.push({
			title: "\"Case\" Status",
			value: consultSelected.fields[consultFields.STATUS],
		})
	}

	const renderDispoTags = values => {
		return values.map((value, index) => {
			let color = '#8c8c8c';
			if (value === consultFields.DISPOSITIONS_FEE_BASED) color = 'cyan';
			if (value === consultFields.DISPOSITIONS_PRO_BONO) color = 'blue';
			if (value === consultFields.DISPOSITIONS_COMPELLING) color = 'magenta';
			return <li key={index}>
				<Tag color={color} key={index}>
					{value}
				</Tag>
			</li>;
		});
	}

	return (
		<>
			<List
				bordered
				itemLayout="horizontal"
				dataSource={dataSource}
				size="small"
				renderItem={item => {
					if (item.key && item.key === consultFields.DISPOSITIONS) {
						return (
							<List.Item key={id}>
								<ul style={{
									listStyleType: 'none',
									paddingInlineStart: 'unset'
								}}>
									{renderDispoTags(item.value)}
								</ul>
							</List.Item>
						)
					}
					return (
						<List.Item key={id}>
							<Typography.Text code>{item.title}</Typography.Text> {item.value}
						</List.Item>
					)
				}}
			/>
		</>
	)
}

export default ConsultationDetails;
