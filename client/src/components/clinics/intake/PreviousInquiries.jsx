import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
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
		title: 'Inquiry type',
		dataIndex: consultFields.TYPE,
		key: consultFields.TYPE,
		responsive: ['md'],
	},
	{
		title: 'Disposition',
		dataIndex: [consultFields.DISPOSITIONS],
		key: 'dispos',
		editable: true,
	},
]

const PreviousInquiries = ({
	inquiries,
	inquirer,
}) => {
	const [isLoading, setIsLoading] = useState(true)
	const [dataSource, setDataSource] = useState([])
	// redux reducers
	const consultations = useSelector((state) => state.consultations.consultations)
	const lawyers = useSelector((state) => state.people.lawyersObject)
	const lawTypes = useSelector((state) => state.lawTypes.lawTypesObject)

	useEffect(() => {
		if (inquiries?.length > 0) {
			const _dataSource = inquiries.reduce((acc, cur) => {
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
	}, [inquiries])

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

		// to create, update, delete rows:
		hasActions={true}
		inquirer={inquirer} // to update
	/>
}

export default PreviousInquiries
