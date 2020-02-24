import React from 'react';
import { List, Typography } from 'antd';
// data
import * as consultFields from '../../../data/consultionFields';
import { getDispoTags, getStatusForEmptyShortName } from '../../../data/consultationData';
import { getPeopleByIds } from '../../../data/peopleData';
import { getLawTypes } from '../../../data/lawTypeData';

const PrevConsultDetails = props => {
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

	dataSource.push({
		title: "Referral Status",
		value: getStatusForEmptyShortName(consultSelected.fields),
	});

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
									{getDispoTags(item.value)}
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

export default PrevConsultDetails;
