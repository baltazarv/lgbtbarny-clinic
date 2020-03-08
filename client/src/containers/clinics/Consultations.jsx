import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';
// components
import ConsultationsTable from '../../components/clinics/consultationsTable/ConsultationsTable';
import ToggleButtons from '../../components/ToggleButtons';
// data
import * as actions from '../../store/actions';
import * as consultFields from '../../data/consultionFields';
import { dispoShortNames } from '../../data/consultationData';

const adminPageTitles = {
	default: 'Clinic Consultations',
	action: 'Consultations Requiring Action',
	impact: 'High Impact Consultations',
	referrals: 'Referral-Eligible Consultations',
	tnc: 'Tuesday Night Clinic Consultations',
	nj: 'NJ Clinic Consultations',
	youth: 'Youth Qlinic Consultations',
};

class Consultations extends Component {

	constructor(props) {
		super(props);
		let filteredValues = [];
		if (this.props.clinic === 'admin') {
			filteredValues = {
				[consultFields.STATUS]: [consultFields.STATUS_REFER, consultFields.STATUS_POSSIBLE_IMPACT],
			}
		}
		this.state = {
			adminTitle: adminPageTitles['action'],
			filteredValues,
		}
	}

	handleFilterBtnClick = val => {
		let dispoFilters = [];
		let statusFilters = [];
		let clinicFilters = [];
		let adminTitle = adminPageTitles['default'];
		if (val === 'action') {
			statusFilters = [consultFields.STATUS_REFER, consultFields.STATUS_POSSIBLE_IMPACT]
			adminTitle = adminPageTitles['action'];
		}
		if (val === 'impact') {
			dispoFilters = [dispoShortNames[consultFields.DISPOSITIONS_COMPELLING], dispoShortNames[consultFields.DISPOSITIONS_IMMIGRATION]];
			adminTitle = adminPageTitles['impact'];
		}
		if (val === 'referrals') {
			dispoFilters = [dispoShortNames[consultFields.DISPOSITIONS_FEE_BASED], dispoShortNames[consultFields.DISPOSITIONS_PRO_BONO]];
			adminTitle = adminPageTitles['referrals'];
		}
		if (val === 'tnc') {
			clinicFilters = [consultFields.CLINIC_TNC];
			adminTitle = adminPageTitles['tnc'];
		}
		if (val === 'nj') {
			clinicFilters = [consultFields.CLINIC_NJ];
			adminTitle = adminPageTitles['nj'];
		}
		if (val === 'youth') {
			clinicFilters = [consultFields.CLINIC_YOUTH];
			adminTitle = adminPageTitles['youth'];
		}
		const filteredValues = {
			[consultFields.DISPOSITIONS]: dispoFilters,
			[consultFields.STATUS]: statusFilters,
			[consultFields.CLINIC_NAME]: clinicFilters,
		}

		this.setState({
			filteredValues,
			adminTitle,
		})
	}

	changeFilters = filteredValues => {
		this.setState({
			adminTitle: adminPageTitles['default'],
			filteredValues,
		})
	}

	render() {

		// from parent
		const {
			clinic
		} = this.props;

		let toggleButtons = null;
		if (clinic === 'admin') {
			const settings = {
				action: { buttonLabel: 'Action Required' },
				impact: { buttonLabel: 'High Impact' },
				referrals: { buttonLabel: 'Referral-Eligible' },
				tnc: { buttonLabel: 'TNC' },
				nj: { buttonLabel: 'NJ' },
				youth: { buttonLabel: 'Youth' },
				all: { buttonLabel: 'All' },
			};
			toggleButtons = <ToggleButtons
				defaultValue="action"
				settings={settings}
				callback={this.handleFilterBtnClick}
			/>;
		}

		return (
			<>
				{toggleButtons}
				<Card.Body>
					<h1 className="h2">{this.props.clinic === 'admin' ? this.state.adminTitle : 'Consultations Completed'}</h1>
					<ConsultationsTable
						clinic={clinic}
						filteredValues={this.state.filteredValues}
						changeFilters={this.changeFilters}
						inquirers={this.props.inquirers}
						lawyers={this.props.lawyers}
						lawTypes={this.props.lawTypes}
						consultations={this.props.consultations} // object
						updateConsultation={this.props.updateConsultation}
					/>
				</Card.Body>
			</>
		)
	}
}

const mapStateToProps = state => {
	return {
		inquirers: state.people.inquirersObject,
		lawyers: state.people.lawyersObject,
		lawTypes: state.lawTypes.lawTypesObject,
		consultations: state.consultations.consultations,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateConsultation: updateObject => dispatch(actions.updateConsultation(updateObject)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Consultations)
