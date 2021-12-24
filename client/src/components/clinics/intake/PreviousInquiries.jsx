import React, { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Card } from 'react-bootstrap'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PreviousTable from '../shared/PreviousTable'
import HelplineList from '../HelplineList'
import FormModal from '../../modals/FormModal'
import AddUpdateInquiry from './AddUpdateInquiry'
// data
import { getLawyerNames } from '../../../data/peopleData'
import * as consultFields from '../../../data/consultFields'
import { formatName } from '../../../data/peopleData'
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
	inquirer,
}) => {
	const [isLoading, setIsLoading] = useState(false)
	const [dataSource, setDataSource] = useState([])
	// redux reducers
	const consultations = useSelector((state) => state.consultations.consultations)
	const lawyers = useSelector((state) => state.people.lawyersObject)
	const lawTypes = useSelector((state) => state.lawTypes.lawTypesObject)
	const [addInqModalOpen, setAddInqModalOpen] = useState(false)

	const inquiries = useMemo(() => {
		if (inquirer) {
			const userId = inquirer.id
			return Object.keys(consultations).reduce((acc, consultId) => {
				const consult = consultations[consultId]
				if (consult?.[consultFields.INQUIRERS] &&
					consult?.[consultFields.TYPE] !== consultFields.TYPE_CLINIC &&
					consult[consultFields.INQUIRERS]?.some((id) => id === userId)
				) {
					acc.push({
						key: consultId,
						...consult,
					})
				}
				return acc
			}, [])
		}
	}, [inquirer, consultations])

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

	if (!inquiries || inquiries?.length === 0) {
		return <>
			<Card className="mb-3 text-center">
				<Card.Body>
					<span className="text-muted">There are no <strong>inquiries</strong> from {formatName(inquirer)}. <Button
						type="primary"
						onClick={() => setAddInqModalOpen(true)}
						size="small"
						icon={<PlusOutlined />}
					>Add inquiry</Button></span>
				</Card.Body>
			</Card>
			<FormModal
				show={addInqModalOpen}
				onHide={() => setAddInqModalOpen(false)}
				header={`Add Inquiry${inquirer ? ` from ${formatName(inquirer)}` : ''}`}
				body={<AddUpdateInquiry
					inquirer={inquirer} // need id
					onHide={() => setAddInqModalOpen(false)}
					isSubmitting={isLoading}
					setIsSubmitting={setIsLoading}
				/>}
				size="lg"
			/>
		</>
	}

	return <>
		<PreviousTable
			title="Previous Inquiries"
			columns={columns}
			dataSource={dataSource}
			options={getHotlineDispoOptions()}
			expandedRowRender={inquirerContactedList}
			isLoading={isLoading}
			setIsLoading={setIsLoading}

			// to create, update, delete rows:
			hasActions={true}
			inquirer={inquirer} // to update
		/>
	</>
}

export default PreviousInquiries
