import React, { useState, useEffect } from 'react';
import { Table, Avatar } from 'antd';
import VisitorList from '../VisitorList';
// data
import * as peopleFields from '../../../data/peopleFields';
import * as consultFields from '../../../data/consultFields';
import { formatName } from '../../../data/peopleData';
import { getLawTypes } from '../../../data/lawTypeData';
import { getPeopleByIds } from '../../../data/peopleData';
// // utils
import { objectIsEmpty, isoToStandardDate } from '../../../utils';

const VisitorsTable = props => {

	const [dataSource, setDataSource] = useState([]);

	// props from parent
	const {
		clinic,
		filteredValues,
		changeFilters,
		inquirers, // inquirersObject
		lawTypes, // lawTypesObject
		consultations,
		lawyers, // lawyersObject
		isLoading,
		loadingDone,
	} = props;

	let columns = [];

	if (clinic === 'admin') {
		columns.push({
			title: '',
			dataIndex: peopleFields.CLINIC_NAME,
			key: peopleFields.CLINIC_NAME,
			filters: [
				{ text: peopleFields.CLINIC_TNC, value: peopleFields.CLINIC_TNC },
				{ text: peopleFields.CLINIC_NJ, value: peopleFields.CLINIC_NJ },
				{ text: peopleFields.CLINIC_YOUTH, value: peopleFields.CLINIC_YOUTH },
			],
			onFilter: (value, record) => value === record[peopleFields.CLINIC_NAME],
			filteredValue: filteredValues[peopleFields.CLINIC_NAME],
			render: (clinicName) => {
				let clinicText = 'TN';
				let color = '#f56a00';
				if (clinicName === peopleFields.CLINIC_NJ) {
					clinicText = 'NJ';
					color = '#00a2ae';
				}
				if (clinicName === peopleFields.CLINIC_YOUTH) {
					clinicText = 'Y';
					color = '#7265e6';
				}
				return <Avatar style={{ backgroundColor: color, verticalAlign: 'middle' }} size="small">{clinicText}</Avatar>
			}
		});
	}

	columns.push({
		title: 'Update Date',
		dataIndex: peopleFields.DATETIME,
		key: peopleFields.DATETIME,
		defaultSortOrder: 'descend',
		sorter: (a, b) => {
			const dateA = new Date(a[peopleFields.DATETIME]);
			const dateB = new Date(b[peopleFields.DATETIME]);
			return dateA - dateB;
		},
	});

	columns.push({
		title: 'Name',
		dataIndex: 'fullname',
		key: 'fullname',
		render: (visitor) => <strong>{visitor}</strong>,
	});

	if (clinic === 'tnc' || clinic === 'youth') {
		columns.push({
			title: 'Visit Regarding',
			dataIndex: peopleFields.LAW_TYPES,
			key: 'visitor',
		});
	}

	if (clinic === 'admin' || clinic === 'nj') {
		columns.push({
			title: 'Actions/Dispo.',
			dataIndex: peopleFields.DISPOSITION,
			key: peopleFields.DISPOSITION,
		});
	}

	useEffect(() => {
		const setTableData = () => {
			let data = [];
			for (var key in inquirers) {
				let fields = inquirers[key];
				if (clinic === 'admin' || (clinic === 'tnc' && fields[peopleFields.CLINIC_NAME] === peopleFields.CLINIC_TNC) || (clinic === 'nj' && fields[peopleFields.CLINIC_NAME] === peopleFields.CLINIC_NJ) || (clinic === 'youth' && fields[peopleFields.CLINIC_NAME] === peopleFields.CLINIC_YOUTH)) {
					const object = {
						key,
						[peopleFields.CLINIC_NAME]: fields[peopleFields.CLINIC_NAME],
						[peopleFields.DATETIME]: isoToStandardDate(fields[peopleFields.DATETIME]),
						fullname: formatName(fields),
						[peopleFields.LAW_TYPES]: getLawTypes(fields[peopleFields.LAW_TYPES], lawTypes),
						[peopleFields.DISPOSITION]: fields[peopleFields.DISPOSITION] ? fields[peopleFields.DISPOSITION].join(', ') : '',
					}
					data.push(object)
				}
			}
			loadingDone();
			return data;
		}

		if (isLoading && !objectIsEmpty(inquirers)) {
			setDataSource(setTableData());
		}
	}, [isLoading, inquirers, lawTypes, clinic, loadingDone])

	const visitorListItems = {
		fields: [
			{
				key: "fullname",
			},
			{
				key: peopleFields.OTHER_NAMES,
			},
			{
				key: peopleFields.LAW_TYPES,
				title: 'Law Type(s) related to visit',
				emptyDefault: 'Not determined.',
			},
			{
				key: peopleFields.EMAIL,
			},
			{
				key: peopleFields.PHONE,
			},
			{
				key: peopleFields.ADDRESS,
			},
			{
				key: peopleFields.GENDER,
			},
			{
				key: peopleFields.PRONOUNS,
			},
			{
				key: peopleFields.INCOME,
			},
			{
				key: peopleFields.INTAKE_NOTES,
				title: peopleFields.INTAKE_NOTES, // override
			},
			{
				key: peopleFields.CONSULTATIONS,
				title: 'Previous Consultations',
				listItems: {
					fields: [
						{
							key: consultFields.LAWYERS,
							emptyDefault: 'Not entered.',
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

	const renderVisitorList = (record) => {
		const visitorSelected = { [record.key]: { ...inquirers[record.key] } };
		return <VisitorList
			visitor={visitorSelected}
			listItems={visitorListItems}
			lawTypes={lawTypes}
			// constultations
			consultations={consultations}
			lawyers={lawyers}
			renderConsultModalTitle={getConsultationsModalTitle}
		/>
	}

  const handleChange = (pagination, filters) => {
		changeFilters(filters);
	};

	return (
		<>
			<Table
				loading={isLoading}
				dataSource={dataSource}
				columns={columns}
				pagination={true}
				size="small"
				expandedRowRender={renderVisitorList}
				onChange={handleChange}
			// scroll={{ x: '100%' }}
			/>
		</>
	)
};

export default VisitorsTable;
