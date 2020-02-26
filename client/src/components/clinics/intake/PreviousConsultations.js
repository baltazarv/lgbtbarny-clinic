import React, { useState } from 'react';
import EditableTable from '../../table/EditableTable';
import ConsultExpandList from '../ConsultExpandList';
// data
import * as peopleFields from '../../../data/peopleFields';
import { getLawyerNames } from '../../../data/peopleData';
import * as consultFields from '../../../data/consultionFields';
import { statuses, getDispoTagsFromShortNames, getStatusForEmptyShortName, getDispoShortNames } from '../../../data/consultationData';
import { getLawTypes } from '../../../data/lawTypeData';
// utils
import { isoToStandardDate } from '../../../utils';

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
		render: dispos => getDispoTagsFromShortNames(dispos),
	},
	{
		title: consultFields.STATUS,
		dataIndex: consultFields.STATUS,
		key: consultFields.STATUS,
		editable: true,
	},
];

const PreviousConsultations = props => {

	const [isLoading, setIsLoading] = useState(true);
	const [dataSource, setDataSource] = useState([]);

	const {
		visitorSelected,
		inquirers,
		consultations,
		updateConsultation,
		lawyers,
		lawTypes,
	} = props;

	const formatDataSource = consultations => {
		const _dataSource = consultations.reduce((acc, cur) => {
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

	if (inquirers && dataSource.length === 0) {
		const consultIds = inquirers[visitorSelected.value][peopleFields.CONSULTATIONS];
		// if visitor has any previous consultations
		if (consultIds) {
			const visitorConsultations = consultIds.map(id => {
				return {
					key: id,
					...consultations[id],
				}
			});
			formatDataSource(visitorConsultations);
		}
	}

	return (
		<>
			{dataSource.length > 0 &&
				<div className="mb-3">
					<div className="form-label">Previous Consultations</div>
					<p className="mb-1"><small>If any referrals have been made, visit <a href="https://www.legal.io/" target="_blank" rel="noopener noreferrer">Legal.io</a> to update status below.</small></p>

					<EditableTable
						loading={isLoading}
						dataSource={dataSource}
						columns={columns}
						options={statuses}
						handleSave={updateDispoStatus}
						expandedRowRender={ConsultExpandList}
					/>
				</div>
			}
		</>
	)
}

export default PreviousConsultations;
