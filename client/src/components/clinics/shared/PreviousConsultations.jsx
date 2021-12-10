import React, { useState } from 'react'
import PreviousTable from './PreviousTable'
import ConsultationList from '../ConsultationList'
// data
import { getLawyerNames } from '../../../data/peopleData'
import * as consultFields from '../../../data/consultFields'
import {
	statuses,
	getDispoTagsFromShortNames,
	getStatusForEmptyShortName,
	getDispoShortNames,
} from '../../../data/consultationData';
import { getLawTypes } from '../../../data/lawTypeData'
// utils
import { isoToStandardDate } from '../../../utils'

const columns = [
	{
		title: 'Date',
		dataIndex: consultFields.CREATED_ON,
		key: 'date',
	},
	{
		title: 'Disposition(s)',
		dataIndex: [consultFields.DISPOSITIONS],
		key: 'dispos',
		render: dispos => {
			if (dispos.length > 0) return getDispoTagsFromShortNames(dispos);
			return 'None made.';
		},
	},
	{
		title: consultFields.STATUS,
		dataIndex: consultFields.STATUS,
		key: consultFields.STATUS,
		editable: true,
		responsive: ['md'],
	},
];

const PreviousConsultations = ({
	visitorConsultations,
	consultations,
	updateConsultation,
	lawyers,
	lawTypes,
}) => {

	const [isLoading, setIsLoading] = useState(true);
	const [dataSource, setDataSource] = useState([]);
	// to not set dataSource more than once for same visitor
	const [consultIds, setConsultIds] = useState([]);

	// set the fields for the table
	const formatDataSource = (_selectedConsultations) => {
		const _dataSource = _selectedConsultations.reduce((acc, cur) => {
			acc.push({
				key: cur.key,
				[consultFields.CREATED_ON]: isoToStandardDate(cur[consultFields.CREATED_ON]),
				[consultFields.DISPOSITIONS]: getDispoShortNames(cur[consultFields.DISPOSITIONS]),
				[consultFields.STATUS]: getStatusForEmptyShortName(cur),
				[consultFields.LAWYERS]: getLawyerNames(cur[consultFields.LAWYERS], lawyers),
				[consultFields.LAW_TYPES]: getLawTypes(cur[consultFields.LAW_TYPES], lawTypes),
				[consultFields.SITUATION]: cur[consultFields.SITUATION],
				[consultFields.REF_SUMMARY]: cur[consultFields.REF_SUMMARY],
			});
			return acc;
		}, []);
		setDataSource(_dataSource);
		setIsLoading(false);
	}

	const updateDispoStatus = tableRow => {
		// (1) update table
		const newData = [...dataSource];
		const index = newData.findIndex(item => tableRow.key === item.key);
		const item = newData[index];
		newData.splice(index, 1, {
			...item,
			...tableRow,
		});
		setDataSource(newData);

		// (2) update db >> (3) update redux state
		const updateObject = {
			id: tableRow.key,
			fields: {
				[consultFields.STATUS]: tableRow[consultFields.STATUS],
			}
		};
		updateConsultation(updateObject);
	}

	// check that the dataSource not set more than once for same visitor
	if (visitorConsultations?.length > 0) {
		const _consultIds = visitorConsultations.map(consult => consult.key);
		if (!consultIds.some(id => id === visitorConsultations[0].key)) {
			setConsultIds(_consultIds);
			formatDataSource(visitorConsultations);
		}
	}

	const consultationList = (record) => {
		return <ConsultationList
			consultation={{ ...consultations[record.key] }}
			lawyers={lawyers}
			lawTypes={lawTypes}
		/>
	}

	return <PreviousTable
		title="Previous Consultations"
		columns={columns}
		dataSource={dataSource}
		options={statuses}
		expandedRowRender={consultationList}
		isLoading={isLoading}
		handleSave={updateDispoStatus}
	/>
}

export default PreviousConsultations;
