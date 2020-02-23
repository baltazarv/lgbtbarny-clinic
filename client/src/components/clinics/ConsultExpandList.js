import React from 'react';
import { List, Typography } from 'antd';
// data
import * as consultFields from '../../data/consultionFields';
import { dispoShortNames } from '../../data/consultationData';

const ConsultExpandList = record => {
	const expandListData = [
		{
			title: "Lawyer(s) Consulted",
			value: record[consultFields.LAWYERS],
		},
		{
			title: "Consultation Notes",
			value: record[consultFields.SITUATION] ? record[consultFields.SITUATION] : "No notes taken."
		},
	];

	// if dispo fee-based or pro bono
	const dispos = record[consultFields.DISPOSITIONS];
	const feeBased = dispoShortNames[consultFields.DISPOSITIONS_FEE_BASED];
	const proBono = dispoShortNames[consultFields.DISPOSITIONS_PRO_BONO];
	if (dispos.some(dispo => dispo === feeBased) || dispos.some(dispo => dispo === proBono)) {
		expandListData.push({
			title: "Type(s) of Law",
			value: record[consultFields.LAW_TYPES],
		});
		expandListData.push({
			title: [consultFields.REF_SUMMARY],
			value: record[consultFields.REF_SUMMARY] ? record[consultFields.REF_SUMMARY] : "No summary for referral entered."
		});
	}

	return (
		<>
			<List
				bordered
				itemLayout="horizontal"
				dataSource={expandListData}
				size="small"
				renderItem={item => {
					return (
						<List.Item>
							<Typography.Text code>{item.title}</Typography.Text> {item.value}
						</List.Item>
					)
				}}
			/>
		</>
	)
}

export default ConsultExpandList;
