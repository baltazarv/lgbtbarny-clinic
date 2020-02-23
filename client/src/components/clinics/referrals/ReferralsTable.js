import React, { useState, useEffect } from 'react';
import { Icon, Modal, Button } from 'antd';
// components
import EditableTable from '../../table/EditableTable';
import InquirerDetails from './InquirerDetails';
import ConsultExpandList from '../ConsultExpandList';
// data
import * as consultFields from '../../../data/consultionFields';
import { statuses, dispoShortNames, getDispoShortNames, getDispoTagsFromShortNames, getStatusForEmptyShortName, filterEligibleConsultations } from '../../../data/consultationData';
import { formatName, getLawyerNames } from '../../../data/peopleData';
import { getLawTypes } from '../../../data/lawTypeData';
// utils
import { objectIsEmpty, isoToStandardDate } from '../../../utils';

const statusFilters = [
	{ text: consultFields.STATUS_REFER, value: consultFields.STATUS_REFER },
	{ text: consultFields.STATUS_REFERRED, value: consultFields.STATUS_REFERRED },
	{ text: consultFields.STATUS_POSSIBLE_IMPACT, value: consultFields.STATUS_POSSIBLE_IMPACT },
	{ text: consultFields.STATUS_IMPACT_CONSIDERED, value: consultFields.STATUS_IMPACT_CONSIDERED },
];

const getVisitorNames = (ids, inquirers) => {
	if (ids && ids.length > 0) {
		return ids.map(id => {
			return formatName(inquirers[id]);
		});
	} else {
		return [];
	}
}

const ReferralsTable = props => {

	const [isLoading, setIsLoading] = useState(true);
	const [dataSource, setDataSource] = useState([]);
	const [visitorModalShown, setVisitorModalShown] = useState(false);
	const [inquirersSelected, setInquirersSelected] = useState({});
	const [visitorModalTitle, setVisitorModalTitle] = useState('');

	// props from parent Referrals
	const {
		inquirers, // inquirersObject
		lawyers, // lawyersObject
		lawTypes, // lawTypesObject
		consultations,
		updateConsultation, // redux function
	} = props;

	const iconStyle = { fontSize: '18px', color: '#1890ff' };

	const columns = [
		{
			title: 'Date',
			dataIndex: consultFields.CREATED_ON,
			key: 'date',
			defaultSortOrder: 'descend',
			sorter: (a, b) => {
				const dateA = new Date(a[consultFields.CREATED_ON]);
				const dateB = new Date(b[consultFields.CREATED_ON]);
				return dateA - dateB;
			},
		},
		{
			title: 'Visitor(s)',
			dataIndex: consultFields.INQUIRERS,
			key: 'visitor',
			render: (visitors, row) => (
				<span>
					{visitors} <Icon style={iconStyle} type="user" onClick={() => showVisitorModal(row)} />
					{/* <Button type="link" onClick={() => showVisitorModal(row)}>{visitors} <Icon style={iconStyle} type="user" /></Button> */}
				</span>
			),
			// doesn't work!?
			// sorter: (a, b) => {
			// 	return a[consultFields.INQUIRERS][0] - b[consultFields.INQUIRERS][0];
			// },
		},
		{
			title: 'Dispositions(s)',
			dataIndex: [consultFields.DISPOSITIONS],
			key: 'dispos',
			render: dispos => getDispoTagsFromShortNames(dispos),
			// doesn't work!?
			// sorter: (a, b) => {
			// 	return a[consultFields.DISPOSITIONS][0] - b[consultFields.DISPOSITIONS][0];
			// },
		},
		{
			title: consultFields.STATUS,
			dataIndex: consultFields.STATUS,
			key: consultFields.STATUS,
			// edit column
			editable: true,
			// filters
			filters: statusFilters,
			defaultFilteredValue: [consultFields.STATUS_REFER, consultFields.STATUS_POSSIBLE_IMPACT],
			onFilter: (value, record) => {
				// dispoIsRef: disposition either fee based or pro-bono
				const dispoIsRef = record[consultFields.DISPOSITIONS].some(dispo => dispo === dispoShortNames[consultFields.DISPOSITIONS_FEE_BASED]) || record[consultFields.DISPOSITIONS].some(dispo => dispo === dispoShortNames[consultFields.DISPOSITIONS_PRO_BONO]);
				// dispoIsCompelling: disposition is highly compelling
				const dispoIsCompelling = record[consultFields.DISPOSITIONS].some(dispo => dispo === dispoShortNames[consultFields.DISPOSITIONS_COMPELLING]);
				if (!record[consultFields.STATUS] && value === consultFields.STATUS_REFER && dispoIsRef) {
					// status is blank, 'Referral Needed' selected, & dispoIsRef
					return true;
				} else if (!record[consultFields.STATUS] && value === consultFields.STATUS_POSSIBLE_IMPACT && dispoIsCompelling) {
					// status is blank, 'Impact Litigation' selected, & dispoIsCompelling
					return true;
				} else {
					return value === record[consultFields.STATUS];
				}
			},
		},
		// {
		// 	title: 'Actions',
		// 	dataIndex: 'action',
		// 	key: 'action',
		// 	render: () => {
		// 		return <span>
		// 			<a style={iconStyle}><Icon type="form" /></a>
		// 		</span>
		// 	}
		// },
	];

	useEffect(() => {
		const setTableData = () => {
			const eligible = filterEligibleConsultations(consultations);
			let data = [];
			for (var key in eligible) {
				let fields = eligible[key];
				const object = {
					key,
					[consultFields.CREATED_ON]: isoToStandardDate(fields[consultFields.CREATED_ON]),
					[consultFields.INQUIRERS]: getVisitorNames(fields[consultFields.INQUIRERS], inquirers),
					[consultFields.DISPOSITIONS]: getDispoShortNames(fields[consultFields.DISPOSITIONS]),
					[consultFields.STATUS]: getStatusForEmptyShortName(fields),
					[consultFields.LAWYERS]: getLawyerNames(fields[consultFields.LAWYERS], lawyers),
					[consultFields.LAW_TYPES]: getLawTypes(fields[consultFields.LAW_TYPES], lawTypes),
					[consultFields.SITUATION]: fields[consultFields.SITUATION],
					[consultFields.REF_SUMMARY]: fields[consultFields.REF_SUMMARY],
				}
				data.push(object)
			}
			return data;
		}

		if (isLoading && !objectIsEmpty(consultations) && !objectIsEmpty(inquirers) && !objectIsEmpty(lawyers) && !objectIsEmpty(lawTypes)) {
			setDataSource(setTableData());
			setIsLoading(false);
		}
	}, [isLoading, consultations, inquirers, lawTypes, lawyers])

	const handleTableChange = (pagination, filters, sorter) => {
		console.log('handleTableChange pagination', pagination, 'filters', filters, 'sorter', sorter)
	};

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

	const showVisitorModal = row => {
		const firstInquirerId = consultations[row.key][consultFields.INQUIRERS][0];
		const inquirerFields = inquirers[firstInquirerId];
		setVisitorModalTitle(formatName(inquirerFields))
		setInquirersSelected({ [firstInquirerId]: inquirerFields });
		setVisitorModalShown(true);
	}

	const hideVisitorModal = () => {
		setInquirersSelected({})
		setVisitorModalShown(false);
	}

	return (
		<>
			<Modal
				title={visitorModalTitle}
				visible={visitorModalShown}
				onOk={hideVisitorModal}
				onCancel={hideVisitorModal}
				footer={[
					<Button key="back" onClick={hideVisitorModal}>
						Close
					</Button>,
				]}>
				<InquirerDetails
					inquirers={inquirers}
					lawyers={lawyers}
					lawTypes={lawTypes}
					consultations={consultations}
					inquirersSelected={inquirersSelected}
				/>
			</Modal>

			<EditableTable
				loading={isLoading}
				dataSource={dataSource}
				columns={columns}
				options={statuses} // edit field pulldown menu items
				onChange={handleTableChange}
				handleSave={updateDispoStatus}
				expandedRowRender={ConsultExpandList}
			/>
		</>
	)
};

export default ReferralsTable;
