/** - from intake on repeat visitor select > previous consultations table expanded
 *  - from consultation form on visitor selected > visitor list on visitor previous consultation item link clicked
 *  - from consultation on list expanded
 */
import React from 'react';
import { List, Typography } from 'antd';
// data
import * as consultFields from '../../data/consultFields';
import { getDispoTags, getStatusForEmptyShortName } from '../../data/consultationData';
import { getPeopleByIds } from '../../data/peopleData';
import { getLawTypes } from '../../data/lawTypeData';

const DISPOSTION_DEFAULT_VALUE = 'Dispostion was not specified.';

const ConsultationList = props => {
	const {
		consultation,
		lawyers,
		lawTypes,
	} = props;

	const key = consultation.key;

	let consultLawyers = 'Consulting lawyer not specified.';
	if (consultation[consultFields.LAWYERS]) {
		consultLawyers = getPeopleByIds(consultation[consultFields.LAWYERS], lawyers);
	}
	let dataSource = [
		{
			title: 'Lawyer(s)',
			value: consultLawyers,
		},
		{
			title: "Consultation Notes",
			value: consultation[consultFields.SITUATION] ? consultation[consultFields.SITUATION] : "No notes taken.",
		},
		{
			title: consultFields.DISPOSITIONS,
			key: consultFields.DISPOSITIONS,
			value: consultation[consultFields.DISPOSITIONS] ? consultation[consultFields.DISPOSITIONS] : DISPOSTION_DEFAULT_VALUE,
		},
	]

	let referralData = [
		{
			title: "Type(s) of Law",
			value: getLawTypes(consultation[consultFields.LAW_TYPES], lawTypes),
		},
		{
			title: consultFields.REF_SUMMARY,
			value: consultation[consultFields.REF_SUMMARY] ? consultation[consultFields.REF_SUMMARY] : 'No summary written.',
		},
	];

	if (consultation[consultFields.DISPOSITIONS]) {
		// old consultations were not marked with dispositions
		const hasEligible = _dispos => {
			return _dispos.some(dispo => {
				if (dispo === consultFields.DISPOSITIONS_FEE_BASED) return true;
				if (dispo === consultFields.DISPOSITIONS_PRO_BONO) return true;
				if (dispo === consultFields.DISPOSITIONS_COMPELLING) return true;
				return false;
			})
		}

		if (hasEligible(consultation[consultFields.DISPOSITIONS])) {
			dataSource = [...dataSource, ...referralData];
		}
	}

	if (consultation[consultFields.EMAIL_TEXT_SENT]) {
		dataSource.push({
			title: consultFields.EMAIL_TEXT_SENT,
			value: consultation[consultFields.EMAIL_TEXT_SENT],
		})
	}

	dataSource.push({
		title: "Referral Status",
		value: getStatusForEmptyShortName(consultation),
	});

	return (
		<>
			<List
				bordered={false}
				itemLayout="horizontal"
				dataSource={dataSource}
				size="small"
				renderItem={item => {
					if (item.key && item.key === consultFields.DISPOSITIONS && item.value !== DISPOSTION_DEFAULT_VALUE) {
						return (
							<List.Item key={`${key}_${item.title}`}>
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
						<List.Item key={`${key}_${item.title}`}>
							<Typography.Text code>{item.title}</Typography.Text> {item.value}
						</List.Item>
					)
				}}
			/>
		</>
	)
}

export default ConsultationList;
