import React, { useState } from 'react'
import PreviousTable from '../shared/PreviousTable'
import HelplineList from '../HelplineList'
// data
import { getLawyerNames } from '../../../data/peopleData'
import * as consultFields from '../../../data/consultFields'
import { getHotlineDispoOptions } from '../../../data/consultationData'
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
]

const PreviousInquiries = ({
	inquiries,
	// from context:
	consultations,
	updateConsultation,
	deleteConsultation,
	lawyers,
	lawTypes,
}) => {
	const [isLoading, setIsLoading] = useState(true)
	const [dataSource, setDataSource] = useState([])
	// to not set dataSource more than once for same visitor
	const [consultIds, setConsultIds] = useState([])

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
			})
			return acc
		}, [])
		setDataSource(_dataSource)
		setIsLoading(false)
	}

	// check that the dataSource not set more than once for same visitor
	if (inquiries?.length > 0) {
		const _consultIds = inquiries.map(consult => consult.key)
		if (!consultIds.some(id => id === inquiries[0].key)) {
			setConsultIds(_consultIds)
			formatDataSource(inquiries)
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

	return <PreviousTable
		title="Previous Inquiries"
		columns={columns}
		dataSource={dataSource}
		options={getHotlineDispoOptions()}
		expandedRowRender={inquirerContactedList}
		isLoading={isLoading}

		// send only if need to create, update, delete rows
		updateConsultation={updateConsultation}
		deleteConsultation={deleteConsultation}
		setDataSource={setDataSource}
	/>
}

export default PreviousInquiries
