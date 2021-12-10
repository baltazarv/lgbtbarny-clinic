/** PrevConsultationTable */
import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import EditableTable from '../../table/EditableTable';
import HelplineList from '../HelplineList';
// data
import { getLawyerNames } from '../../../data/peopleData';
import * as consultFields from '../../../data/consultFields';
import { getHotlineDispoOptions } from '../../../data/consultationData';
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
		title: 'Contact type',
		dataIndex: consultFields.TYPE,
		key: consultFields.TYPE,
		responsive: ['md'],
	},
	{
		title: 'Last response',
		dataIndex: [consultFields.DISPOSITIONS],
		key: 'dispos',
		editable: true,
	},
];

const PreviousInquiries = ({
	inquiries,
	// from context:
	consultations,
	updateConsultation,
	lawyers,
	lawTypes,
}) => {
	const [isLoading, setIsLoading] = useState(true);
	const [dataSource, setDataSource] = useState([]);
	// to not set dataSource more than once for same visitor
	const [consultIds, setConsultIds] = useState([]);

	// useEffect(() => {
	// 	console.log('dataSource', dataSource)
	// }, [dataSource])

	// useEffect(() => {
	// 	console.log('consultIds', consultIds)
	// }, [consultIds])

	const formatDataSource = (_selectedConsultations) => {
		const _dataSource = _selectedConsultations.reduce((acc, cur) => {
			acc.push({
				key: cur.key,
				[consultFields.TYPE]: cur[consultFields.TYPE],
				[consultFields.CREATED_ON]: isoToStandardDate(cur[consultFields.CREATED_ON]),
				[consultFields.DISPOSITIONS]: cur[consultFields.DISPOSITIONS],
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

	// update consultFields.DISPOSITIONS
	const updateLastResponse = tableRow => {
		// (1) update table
		const newData = [...dataSource]
		const index = newData.findIndex(item => tableRow.key === item.key)
		const item = newData[index]
		newData.splice(index, 1, {
			...item,
			...tableRow,
		})
		setDataSource(newData)

		// (2) update db >> (3) update redux state
		const updateObject = {
			id: tableRow.key,
			// field put inside an array to update
			fields: {
				[consultFields.DISPOSITIONS]: [tableRow[consultFields.DISPOSITIONS]],
			}
		}

		updateConsultation(updateObject)
	}

	// check that the dataSource not set more than once for same visitor
	if (inquiries?.length > 0) {
		const _consultIds = inquiries.map(consult => consult.key);
		if (!consultIds.some(id => id === inquiries[0].key)) {
			setConsultIds(_consultIds);
			formatDataSource(inquiries);
		}
	}

	// expanded row from Consultations table
	const inquirerContactedList = (record) => {
		return <HelplineList
			inquiry={{ ...consultations[record.key] }}
			lawyers={lawyers}
			lawTypes={lawTypes}
		/>
	}

	return (
		<>
			{dataSource.length > 0 &&
				<Card className="p-4 mb-3">
					<Card.Body className="p-0">
						<Card.Title className="h5 mb-1">Inquiries</Card.Title>
						{/* should not use Card.Text b/c puts table in a <p> tag, which cause error/warnings */}
						<Card.Text>
							{/* <p className="mb-1"><small>If any referrals have been made, visit <a href="https://www.legal.io/" target="_blank" rel="noopener noreferrer">Legal.io</a> to update status below.</small></p> */}

							<EditableTable
								loading={isLoading}
								dataSource={dataSource}
								columns={columns}
								options={getHotlineDispoOptions()}
								handleSave={updateLastResponse}
								expandedRowRender={inquirerContactedList}
							/>
						</Card.Text>
					</Card.Body>
				</Card>
			}
		</>
	)
}

export default PreviousInquiries;
