import React, { useState, useEffect } from 'react';
import { Tag, Icon, List, Typography } from 'antd';
// components
import EditableReferralsTable from './EditableReferralsTable';
// data
import * as consultFields from '../../data/consultionFields';
import { getLawTypes } from '../../data/lawTypeData';
import { filterEligibleConsultations } from '../../data/consultationData';
import { formatName } from '../../data/peopleData';
// utils
import { objectIsEmpty, isoToStandardDate } from '../../utils';

const dispoShortNames = {
	[consultFields.DISPOSITIONS_FEE_BASED]: "Fee-based",
	[consultFields.DISPOSITIONS_PRO_BONO]: "Pro Bono",
	[consultFields.DISPOSITIONS_COMPELLING]: "Highly Compelling",
}

const statuses = [
	consultFields.STATUS_ASSIGNED,
	consultFields.STATUS_REFER,
	consultFields.STATUS_REFERRED,
	// consultFields.STATUS_IMPACT,
];

const statusFilters = [
	{ text: consultFields.STATUS_REFER, value: consultFields.STATUS_REFER },
	{ text: consultFields.STATUS_IMPACT, value: consultFields.STATUS_IMPACT },
	{ text: consultFields.STATUS_REFERRED, value: consultFields.STATUS_REFERRED },
];

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
		render: visitor => (
			<span>
				{visitor} <a><Icon style={iconStyle} type="user" /></a>
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
		render: dispos => (
			<span>
				{dispos.map((dispo, index) => {
					let color = '#8c8c8c';
					if (dispo === dispoShortNames[consultFields.DISPOSITIONS_FEE_BASED]) color = 'cyan';
					if (dispo === dispoShortNames[consultFields.DISPOSITIONS_PRO_BONO]) color = 'blue';
					if (dispo === dispoShortNames[consultFields.DISPOSITIONS_COMPELLING]) color = 'magenta';
					return (
						<Tag color={color} key={index}>
							{dispo}
						</Tag>
					);
				})}
			</span>
		),
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
		defaultFilteredValue: [consultFields.STATUS_REFER, consultFields.STATUS_IMPACT],
		onFilter: (value, record) => {
			// dispoIsRef: disposition either fee based or pro-bono
			const dispoIsRef = record[consultFields.DISPOSITIONS].some(dispo => dispo === dispoShortNames[consultFields.DISPOSITIONS_FEE_BASED]) || record[consultFields.DISPOSITIONS].some(dispo => dispo === dispoShortNames[consultFields.DISPOSITIONS_PRO_BONO]);
			// dispoIsCompelling: disposition is highly compelling
			const dispoIsCompelling = record[consultFields.DISPOSITIONS].some(dispo => dispo === dispoShortNames[consultFields.DISPOSITIONS_COMPELLING]);
			if (!record[consultFields.STATUS] && value === consultFields.STATUS_REFER && dispoIsRef) {
				// status is blank, 'Referral Needed' selected, & dispoIsRef
				return true;
			} else if (!record[consultFields.STATUS] && value === consultFields.STATUS_IMPACT && dispoIsCompelling) {
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

const getVisitorNames = (ids, inquirers) => {
	if (ids && ids.length > 0) {
		return ids.map(id => {
			return formatName(inquirers[id]);
		});
	} else {
		return [];
	}
}

const getLawyerNames = (ids, lawyers) => {
	if (ids && ids.length > 0) {
		return ids.map(id => {
			return formatName(lawyers[id]);
		}).join(', ');
	} else {
		return 'Lawyers not specified.';
	}
}

const getDispoShortNames = dispos => {
	if (dispos && dispos.length > 0) return dispos.map(dispo => dispoShortNames[dispo]);
	return [];
}

const fillInEmptyStatuses = object => {
	const statusField = object[consultFields.STATUS];
	const dispoField = dispoShortNames[object[consultFields.DISPOSITIONS]];
	// fee-base or pro-bono => reference needed
	if (!statusField && (dispoField === dispoShortNames[consultFields.DISPOSITIONS_FEE_BASED] || dispoField === dispoShortNames[consultFields.DISPOSITIONS_PRO_BONO])) {
		return consultFields.STATUS_REFER;
	}
	// compelling => high impact
	if (!statusField && (dispoField === dispoShortNames[consultFields.DISPOSITIONS_COMPELLING])) {
		return consultFields.STATUS_IMPACT;
	}
	return object[consultFields.STATUS];
}

const ReferralsTable = props => {

	const [isLoading, setIsLoading] = useState(true);
	const [dataSource, setDataSource] = useState([]);

	// props from parent Referrals
	const {
		updateConsultation, // redux function
	} = props;

	useEffect(() => {
		if (isLoading && !objectIsEmpty(props.consultations) && !objectIsEmpty(props.inquirers) && !objectIsEmpty(props.lawyers) && !objectIsEmpty(props.lawTypes)) {
			setDataSource(setTableData());
			setIsLoading(false);
		}
	})

	const setTableData = () => {
		const { consultations, inquirers, lawyers, lawTypes } = props;
		const eligible = filterEligibleConsultations(consultations);
		let data = [];
		for (var key in eligible) {
			let fields = eligible[key];
			const object = {
				key,
				// convert from iso to other date format
				[consultFields.CREATED_ON]: isoToStandardDate(fields[consultFields.CREATED_ON]),
				// get visitors' full names
				[consultFields.INQUIRERS]: getVisitorNames(fields[consultFields.INQUIRERS], inquirers),
				// convert to short name
				[consultFields.DISPOSITIONS]: getDispoShortNames(fields[consultFields.DISPOSITIONS]),
				[consultFields.STATUS]: fillInEmptyStatuses(fields),
				[consultFields.LAWYERS]: getLawyerNames(fields[consultFields.LAWYERS], lawyers),
				[consultFields.LAW_TYPES]: getLawTypes(fields[consultFields.LAW_TYPES], lawTypes),
				[consultFields.SITUATION]: fields[consultFields.SITUATION],
				[consultFields.REF_SUMMARY]: fields[consultFields.REF_SUMMARY],
			}
			data.push(object)
		}
		return data;
	}

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

	const referralsExpandList = (record, index, indent, expanded) => {
		const expandListData = [
			{
				title: "Lawyer(s) Consulted",
				value: record[consultFields.LAWYERS],
			},
			{
				title: "Type(s) of Law",
				value: record[consultFields.LAW_TYPES],
			},
			{
				title: "Consultation Notes",
				value: record[consultFields.SITUATION] ? record[consultFields.SITUATION] : "No notes taken."
			},
		];

		// if disp compelling, no ref summary
		if (!record[consultFields.DISPOSITIONS].every(dispo => dispo === dispoShortNames[consultFields.DISPOSITIONS_COMPELLING])) {
			expandListData.push({
				title: [consultFields.REF_SUMMARY],
				value: record[consultFields.REF_SUMMARY] ? record[consultFields.REF_SUMMARY] : "No summary for referral entered."
			})
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

	return (
		<>
			<EditableReferralsTable
				loading={isLoading}
				dataSource={dataSource}
				columns={columns}
				statuses={statuses} // edit field pulldown menu items
				onChange={handleTableChange}
				handleSave={updateDispoStatus}
				expandedRowRender={referralsExpandList}
			/>
		</>
	)
};

export default ReferralsTable;
