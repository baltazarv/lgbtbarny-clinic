import React from 'react';
import { connect } from 'react-redux';
import { Table, Tag, Icon, List, Typography } from 'antd';
// data
import * as consultFields from '../../data/consultionFields';
import * as lawTypeData from '../../data/lawTypeData';
import { formatName } from '../../data/dataTransforms';

import { Menu } from 'antd';

const menu = (
	<Menu>
		<Menu.Item>Action 1</Menu.Item>
		<Menu.Item>Action 2</Menu.Item>
	</Menu>
);

const dispoShortNames = {
	[consultFields.DISPOSITIONS_FEE_BASED]: "Fee-based",
	[consultFields.DISPOSITIONS_PRO_BONO]: "Pro Bono",
	[consultFields.DISPOSITIONS_COMPELLING]: "Highly Compelling",
}

const getDispoFilters = () => {
	let filters = [];
	for (var dispo in dispoShortNames) {
		let value = dispoShortNames[dispo];
		filters.push({
			text: value,
			value: value,
		})
	}
	return filters;
}

const statusFilters = [
	{ text: consultFields.STATUS_REFER, value: consultFields.STATUS_REFER },
	{ text: consultFields.STATUS_IMPACT, value: consultFields.STATUS_IMPACT },
	{ text: consultFields.STATUS_REFERRED, value: consultFields.STATUS_REFERRED },
];

const iconStyle = { fontSize: '18px', color: '#1890ff' };

const tableColumns = [
	{
		title: 'Date',
		dataIndex: consultFields.CREATED_ON,
		key: consultFields.CREATED_ON,
	},
	{
		title: 'Visitor(s)',
		dataIndex: consultFields.INQUIRERS,
		key: 'visitor',
		render: visitor => (
			<span>
				{visitor} <a><Icon style={iconStyle} type="user" /></a>
			</span>
		)
	},
	{
		title: 'Dispositions(s)',
		dataIndex: [consultFields.DISPOSITIONS],
		key: 'dispos',
		render: dispos => (
			<span>
				{dispos.map(dispo => {
					let color = 'cyan';
					if (dispo === dispoShortNames[consultFields.DISPOSITIONS_PRO_BONO]) {
						color = 'blue';
					} else if (dispo === dispoShortNames[consultFields.DISPOSITIONS_COMPELLING]) {
						color = 'magenta';
					}
					return (
						<Tag color={color} key={dispo}>
							{dispo}
						</Tag>
					);
				})}
			</span>
		),
	},
	{
		title: consultFields.STATUS,
		dataIndex: consultFields.STATUS,
		key: consultFields.STATUS,
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
	{
		title: 'Actions',
		dataIndex: 'action',
		key: 'action',
		render: () => {
			return <span>
				<a style={iconStyle}><Icon type="form" /></a>
			</span>
		}
	},
];

const formatDate = isoDate => {
	let date = new Date(isoDate);
	return (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
}

const getVisitorNames = (ids, inquirers) => {
	return inquirers.reduce((acc, cur) => {
		const found = ids.find(id => id === cur.id);
		if (found) {
			acc.push(formatName(cur));
		}
		return acc;
	}, []);
}

const getLawyerNames = (ids, lawyers) => {
	if (ids && ids.length > 0 && lawyers && lawyers.length > 0) {
		let _lawyers = lawyers.reduce((acc, cur) => {
			const found = ids.find(id => id === cur.id);
			if (found) {
				acc.push(formatName(cur));
			}
			return acc;
		}, []);
		return _lawyers.length > 0 ? _lawyers.join(', ') : 'Lawyers not specified.';
	} else {
		return '';
	}
}

const getLawTypes = (ids, lawTypes) => {
	if (ids && ids.length > 0 && lawTypes && lawTypes.length > 0) {
		let _lawTypes = lawTypes.reduce((acc, cur) => {
			const found = ids.find(id => id === cur.id);
			if (found) {
				acc.push(cur[lawTypeData.NAME]);
			}
			return acc;
		}, []);
		return _lawTypes.length > 0 ? _lawTypes.join(', ') : 'Law type not specified.';
	} else {
		return '';
	}
}

const getDispoShortNames = dispos => {
	if (dispos && dispos.length > 0) return dispos.map(dispo => dispoShortNames[dispo]);
	return [];
}

const tableData = (consultations, inquirers, lawyers, lawTypes) => {
	return consultations.map(item => {
		return ({
			key: item.id,
			// convert from iso to other date format
			[consultFields.CREATED_ON]: formatDate(item.fields[consultFields.CREATED_ON]),
			// get visitors' full names
			[consultFields.INQUIRERS]: getVisitorNames(item.fields[consultFields.INQUIRERS], inquirers),
			// convert to short name
			[consultFields.DISPOSITIONS]: getDispoShortNames(item.fields[consultFields.DISPOSITIONS]),
			[consultFields.STATUS]: item.fields[consultFields.STATUS],
			[consultFields.LAWYERS]: getLawyerNames(item.fields[consultFields.LAWYERS], lawyers),
			[consultFields.LAW_TYPES]: getLawTypes(item.fields[consultFields.LAW_TYPES], lawTypes),
			[consultFields.SITUATION]: item.fields[consultFields.SITUATION],
			[consultFields.REF_SUMMARY]: item.fields[consultFields.REF_SUMMARY],
		})
	});
}

const ReferralsTable = props => {

	const handleTableChange = (pagination, filters, sorter) => {
		console.log('handleTableChange pagination', pagination, 'filters', filters, 'sorter', sorter)
	};

	const referralsExpandList = (record, index, indent, expanded) => {
		console.log('referralsExpandList record', record, 'index', index, 'indent', indent, 'expanded', expanded)

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
				value: record[consultFields.SITUATION] ? record[consultFields.SITUATION] : "No intake notes."
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
			<Table
				columns={tableColumns}
				rowKey={record => record.key}
				dataSource={tableData(props.consultations, props.inquirers, props.lawyers, props.lawTypes)}
				pagination={false}
				onChange={handleTableChange}
				loading={props.isLoading}
				size="middle"
				expandedRowRender={referralsExpandList}
			/>
		</>
	)
};

const mapStateToProps = state => {
	return {
		inquirers: state.people.inquirers,
		lawyers: state.people.lawyers,
		lawTypes: state.lawTypes.lawTypes,
	}
}

export default connect(mapStateToProps)(ReferralsTable)
