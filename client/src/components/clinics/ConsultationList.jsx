/** - from intake on repeat visitor select > previous consultations table expanded
 *  - from consultation form on visitor selected > visitor list on visitor previous consultation item link clicked
 *  - from consultation on list expanded
 */
import React from 'react';
import { List, Typography } from 'antd';
// data
import * as consultFields from '../../data/consultionFields';
import { getDispoTags, getStatusForEmptyShortName } from '../../data/consultationData';
import { getPeopleByIds } from '../../data/peopleData';
import { getLawTypes } from '../../data/lawTypeData';

const DISPOSTION_DEFAULT_VALUE = 'Dispostion was not specified.';

const ConsultationList = props => {
	const {
		consultSelected,
		lawyers,
		lawTypes,
	} = props;

	const key = Object.keys(consultSelected)[0];
	const fields = consultSelected[key];

	let consultLawyers = 'Consulting lawyer not specified.';
	if (fields[consultFields.LAWYERS]) {
		consultLawyers = getPeopleByIds(fields[consultFields.LAWYERS], lawyers);
	}
	let dataSource = [
		{
			title: 'Lawyer(s)',
			value: consultLawyers,
		},
		{
			title: "Consultation Notes",
			value: fields[consultFields.SITUATION] ? fields[consultFields.SITUATION] : "No notes taken.",
		},
		{
			title: consultFields.DISPOSITIONS,
			key: consultFields.DISPOSITIONS,
			value: fields[consultFields.DISPOSITIONS] ? fields[consultFields.DISPOSITIONS] : DISPOSTION_DEFAULT_VALUE,
		},
	]

	let referralData = [
		{
			title: "Type(s) of Law",
			value: getLawTypes(fields[consultFields.LAW_TYPES], lawTypes),
		},
		{
			title: consultFields.REF_SUMMARY,
			value: fields[consultFields.REF_SUMMARY] ? fields[consultFields.REF_SUMMARY] : 'No summary written.',
		},
	];

	if (fields[consultFields.DISPOSITIONS]) {
		// old consultations were not marked with dispositions
		const hasEligible = _dispos => {
			return _dispos.some(dispo => {
				if (dispo === consultFields.DISPOSITIONS_FEE_BASED) return true;
				if (dispo === consultFields.DISPOSITIONS_PRO_BONO) return true;
				if (dispo === consultFields.DISPOSITIONS_COMPELLING) return true;
				return false;
			})
		}

		if (hasEligible(fields[consultFields.DISPOSITIONS])) {
			dataSource = [...dataSource, ...referralData];
		}
	}

	if (fields[consultFields.EMAIL_TEXT_SENT]) {
		dataSource.push({
			title: consultFields.EMAIL_TEXT_SENT,
			value: fields[consultFields.EMAIL_TEXT_SENT],
		})
	}

	dataSource.push({
		title: "Referral Status",
		value: getStatusForEmptyShortName(fields),
	});

	return (
		<>
			<List
				bordered
				itemLayout="horizontal"
				dataSource={dataSource}
				size="small"
				renderItem={item => {
					if (item.key && item.key === consultFields.DISPOSITIONS && item.value !== DISPOSTION_DEFAULT_VALUE) {
						return (
							<List.Item key={key}>
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
						<List.Item key={key}>
							<Typography.Text code>{item.title}</Typography.Text> {item.value}
						</List.Item>
					)
				}}
			/>
		</>
	)
}

export default ConsultationList;
