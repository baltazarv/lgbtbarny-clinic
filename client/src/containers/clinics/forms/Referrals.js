import React, { Component } from 'react';
import { connect } from 'react-redux';
// components
import { Tag, Icon } from 'antd';
import ConsultTable from '../../../components/clinics/ReferConsultTable';
// data
import { getReferralConsultations } from '../../../data/consultationData';
import * as consultFields from '../../../data/consultionFields';
import * as peopleFields from '../../../data/peopleFields';
import { formatName } from '../../../data/dataTransforms';

const dispoShortNames = {
	[consultFields.DISPOSITIONS_FEE_BASED]: "Fee-based",
	[consultFields.DISPOSITIONS_PRO_BONO]: "Pro Bono",
	[consultFields.DISPOSITIONS_COMPELLING]: "Highly Compelling",
}

const iconStyle = {fontSize: '18px', color: '#1890ff'};

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

class Referrals extends Component {
	constructor() {
		super();
		this.state = {
			consultations: [],
			tableIsLoading: true,
		}
		this.getAllConsultations = this.getAllConsultations.bind(this);
	}

	componentDidUpdate(prevProps) {
		if (this.props.inquirers.length > 0 && this.props.inquirers.length !== prevProps.inquirers.length) {
			this.getAllConsultations();
			this.setState({
				tableIsLoading: false,
			})
		}
	}

	async getAllConsultations() {
		const results = await getReferralConsultations();
		// console.log(results);

		const consultations = results.payload.map(item => {
			return ({
				key: item.id,
				// convert from iso to other date format
				[consultFields.CREATED_ON]: this.formatDate(item.fields[consultFields.CREATED_ON]),
				// get visitors' full names
				[consultFields.INQUIRERS]: this.getVisitorName(item.fields[consultFields.INQUIRERS]),
				// convert to short name
				[consultFields.DISPOSITIONS]: this.getDispoShortNames(item.fields[consultFields.DISPOSITIONS]),
				[consultFields.STATUS]: item.fields[consultFields.STATUS],
			})
		});
		this.setState({
			consultations,
		})
	}

	formatDate = isoDate => {
		let date = new Date(isoDate);
		return (date.getMonth()+1) + '/' + date.getDate() + '/' + date.getFullYear();
	}

	getVisitorName = ids => {
		return this.props.inquirers.reduce((acc, cur) => {
			const found = ids.find(id => id === cur.id);
			if (found) {
				acc.push(formatName(cur));
			}
			return acc;
		}, []);
	}

	getDispoShortNames = dispos => {
		if (dispos && dispos.length > 0) return dispos.map(dispo => dispoShortNames[dispo]);
		return [];
	}

	render() {
		return (
			<>
				<h1 className="h2">Referrals</h1>
				<ConsultTable
					data={this.state.consultations}
					columns={tableColumns}
					expandedRowRender={record => <p style={{ margin: 0 }}>{record.description}</p>}
					isLoading={this.state.tableIsLoading}
				/>
			</>
		)
	}
}

const mapStateToProps = state => {
	return {
		inquirers: state.people.inquirers,
		clinicSettings: state.clinics.clinicSettings,
		currentClinic: state.clinics.currentClinic,
	}
}

export default connect(mapStateToProps)(Referrals)
