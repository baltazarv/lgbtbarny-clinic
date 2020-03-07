import React, { useState, useEffect } from 'react';
import { Icon, Modal, Button, Avatar } from 'antd';
// components
import EditableTable from '../../table/EditableTable';
import ConsultationList from '../ConsultationList';
import VisitorList from '../VisitorList';
// data
import * as consultFields from '../../../data/consultionFields';
import { statuses, dispoShortNames, getDispoShortNames, getDispoTagsFromShortNames, getStatusForEmptyShortName } from '../../../data/consultationData'; // , filterEligibleConsultations
import * as peopleFields from '../../../data/peopleFields';
import { formatName, getLawyerNames, getPeopleByIds } from '../../../data/peopleData';
import { getLawTypes } from '../../../data/lawTypeData';
// utils
import { objectIsEmpty, isoToStandardDate } from '../../../utils';

const statusFilters = [
	{ text: consultFields.STATUS_REFER, value: consultFields.STATUS_REFER },
	{ text: consultFields.STATUS_REFERRED, value: consultFields.STATUS_REFERRED },
	{ text: consultFields.STATUS_REFERRAL_NOT_PICKED_UP, value: consultFields.STATUS_REFERRAL_NOT_PICKED_UP },
	{ text: consultFields.STATUS_REFERRAL_PICKED_UP, value: consultFields.STATUS_REFERRAL_PICKED_UP },
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

const ConsultationsTable = props => {

	// from parent
	const {
		clinic
	} = props;

	const [isLoading, setIsLoading] = useState(true);
	const [dataSource, setDataSource] = useState([]);
	const [visitorModalShown, setVisitorModalShown] = useState(false);
	const [inquirerSelected, setInquirerSelected] = useState({});
	const [visitorModalTitle, setVisitorModalTitle] = useState('');

	let defaultStatusFilters = [];
	if (clinic === 'admin') defaultStatusFilters = [consultFields.STATUS_REFER, consultFields.STATUS_POSSIBLE_IMPACT];

	// props from parent
	const {
		inquirers, // inquirersObject
		lawyers, // lawyersObject
		lawTypes, // lawTypesObject
		consultations,
		updateConsultation, // redux function
	} = props;

	const iconStyle = { fontSize: '18px', color: '#1890ff' };

	const getDispoFilters = () => {
		let _dispoFilters = [];
		for (var key in dispoShortNames) {
			_dispoFilters.push({ text: dispoShortNames[key], value: dispoShortNames[key] })
		}
		return _dispoFilters;
	}

	const columns = [];

	if (clinic === 'admin') {
		columns.push({
			title: '',
			dataIndex: consultFields.CLINIC_NAME,
			key: consultFields.CLINIC_NAME,
			width: 36,
			render: (clinicName) => {
				console.log(clinicName, consultFields.CLINIC_NJ)
				let clinicText = 'TN';
				let color = '#f56a00';
				if (clinicName === consultFields.CLINIC_NJ) {
					clinicText = 'NJ';
					color = '#00a2ae';
				}
				if (clinicName === consultFields.CLINIC_YOUTH) {
					clinicText = 'Y';
					color = '#7265e6';
				}
				return <Avatar style={{ backgroundColor: color, verticalAlign: 'middle' }} size="small">{clinicText}</Avatar>
			}
		});
	}

	columns.push({
		title: 'Date',
		dataIndex: consultFields.DATETIME,
		key: 'date',
		width: 70,
		defaultSortOrder: 'descend',
		sorter: (a, b) => {
			const dateA = new Date(a[consultFields.DATETIME]);
			const dateB = new Date(b[consultFields.DATETIME]);
			return dateA - dateB;
		},
	});

	columns.push({
		title: 'Visitor(s)',
		dataIndex: consultFields.INQUIRERS,
		key: 'visitor',
		render: (visitors, row) => (
			<span>
				{visitors} <Icon style={iconStyle} type="user" onClick={() => showVisitorModal(row)} />
				{/* <Button type="link" onClick={() => showVisitorModal(row)}>{visitors} <Icon style={iconStyle} type="user" /></Button> */}
			</span>
		),
	});

	columns.push({
		title: 'Dispositions',
		dataIndex: [consultFields.DISPOSITIONS],
		key: 'dispos',
		filters: getDispoFilters(),
		onFilter: (value, record) => {
			return record[consultFields.DISPOSITIONS].some(val => val === value);
		},
		render: dispos => getDispoTagsFromShortNames(dispos),
	});

	columns.push({
		title: 'Referral Status',
		dataIndex: consultFields.STATUS,
		key: consultFields.STATUS,
		className: 'referrals-status-col',
		// edit column
		editable: true,
		// filters
		filters: statusFilters,
		defaultFilteredValue: defaultStatusFilters,
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
	});

	useEffect(() => {
		const setTableData = () => {
			let eligible = consultations;
			// if (clinic === 'admin') eligible = filterEligibleConsultations(consultations);
			let data = [];
			for (var key in eligible) {
				let fields = eligible[key];
				if (clinic === 'admin' || (clinic === 'tnc' && fields[consultFields.CLINIC_NAME] === consultFields.CLINIC_TNC) || (clinic === 'youth' && fields[consultFields.CLINIC_NAME] === consultFields.CLINIC_YOUTH)) {
					const object = {
						key,
						[consultFields.DATETIME]: isoToStandardDate(fields[consultFields.DATETIME]),
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
			}
			return data;
		}

		if (isLoading && !objectIsEmpty(consultations) && !objectIsEmpty(inquirers) && !objectIsEmpty(lawyers) && !objectIsEmpty(lawTypes)) {
			setDataSource(setTableData());
			setIsLoading(false);
		}
	}, [isLoading, consultations, inquirers, lawTypes, lawyers, clinic])

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
		setInquirerSelected({ [firstInquirerId]: inquirerFields });
		setVisitorModalShown(true);
	}

	const hideVisitorModal = () => {
		setInquirerSelected({})
		setVisitorModalShown(false);
	}

	const getConsultationsModalTitle = consultation => {
		if (!objectIsEmpty(consultation)) {
			const key = Object.keys(consultation)[0];
			const fields = consultation[key];
			if (fields[consultFields.INQUIRERS]) {
				return <span>Consultation for {getPeopleByIds(fields[consultFields.INQUIRERS], inquirers)} on {isoToStandardDate(fields[consultFields.DATETIME])}</span>;
			}
		}
		return null;
	}

	const visitorModalListItems = {
		fields: [
			{
				key: peopleFields.OTHER_NAMES,
			},
			{
				key: peopleFields.LAW_TYPES,
				title: 'Law Type(s) – determined at intake',
				emptyDefault: 'Not determined.',
			},
			{
				key: peopleFields.INTAKE_NOTES,
				title: peopleFields.INTAKE_NOTES, // override
			},
			{
				key: peopleFields.PHONE,
			},
			{
				key: peopleFields.EMAIL,
			},
			{
				key: peopleFields.CONSULTATIONS,
				listItems: {
					fields: [
						{
							key: consultFields.LAWYERS,
							emptyDefault: 'Not specified.',
						},
						{
							key: consultFields.SITUATION,
						},
						{
							key: consultFields.DISPOSITIONS,
						},
						{
							key: consultFields.LAW_TYPES,
						},
						{
							key: consultFields.REF_SUMMARY,
						},
						{
							key: consultFields.STATUS,
						},
					]
				}
			},
		],
	}

	const consultationList = (record) => {
		const consultSelected = { [record.key]: { ...consultations[record.key] } };
		return <ConsultationList
			consultSelected={consultSelected}
			lawyers={lawyers}
			lawTypes={lawTypes}
		/>
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
				{/* visitor needs to be single visitor */}
				<VisitorList
					visitor={inquirerSelected}
					listItems={visitorModalListItems}
					lawTypes={lawTypes}
					// constultations
					consultations={consultations}
					lawyers={lawyers}
					renderConsultModalTitle={getConsultationsModalTitle}
				/>
			</Modal>

			<EditableTable
				loading={isLoading}
				dataSource={dataSource}
				columns={columns}
				options={statuses} // edit field pulldown menu items
				onChange={handleTableChange}
				handleSave={updateDispoStatus}
				expandedRowRender={consultationList}
				pagination={true}
			/>
		</>
	)
};

export default ConsultationsTable;