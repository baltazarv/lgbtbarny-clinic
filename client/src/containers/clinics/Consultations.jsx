import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { Card, Row, Col } from 'react-bootstrap'
import { ReloadOutlined } from '@ant-design/icons'
// components
import ConsultationsTable from '../../components/clinics/consultationsTable/ConsultationsTable'
import ToggleButtons from '../../components/ToggleButtons';
// data
import * as actions from '../../store/actions';
import * as consultFields from '../../data/consultFields';
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
      isLoading: true,
		}
    this.refreshTable = this.refreshTable.bind(this);
	}

	handleFilterBtnClick = val => {
		let toggleButtonValue = '';
		let dispoFilters = [];
		let statusFilters = [];
		let clinicFilters = [];
		let adminTitle = adminPageTitles['default'];
		if (val === 'action') {
      toggleButtonValue = 'action';
			statusFilters = [consultFields.STATUS_REFER, consultFields.STATUS_POSSIBLE_IMPACT]
			adminTitle = adminPageTitles['action'];
		}
		if (val === 'impact') {
      toggleButtonValue = 'impact';
			dispoFilters = [dispoShortNames[consultFields.DISPOSITIONS_COMPELLING], dispoShortNames[consultFields.DISPOSITIONS_IMMIGRATION]];
			adminTitle = adminPageTitles['impact'];
		}
		if (val === 'referrals') {
      toggleButtonValue = 'referrals';
			dispoFilters = [dispoShortNames[consultFields.DISPOSITIONS_FEE_BASED], dispoShortNames[consultFields.DISPOSITIONS_PRO_BONO]];
			adminTitle = adminPageTitles['referrals'];
		}
		if (val === 'tnc') {
      toggleButtonValue = 'tnc';
			clinicFilters = [consultFields.CLINIC_TNC];
			adminTitle = adminPageTitles['tnc'];
		}
		if (val === 'nj') {
      toggleButtonValue = 'nj';
			clinicFilters = [consultFields.CLINIC_NJ];
			adminTitle = adminPageTitles['nj'];
		}
		if (val === 'youth') {
      toggleButtonValue = 'youth';
			clinicFilters = [consultFields.CLINIC_YOUTH];
			adminTitle = adminPageTitles['youth'];
		}
		if (val === 'all') {
      toggleButtonValue = 'all';
		}
		const filteredValues = {
			[consultFields.DISPOSITIONS]: dispoFilters,
			[consultFields.STATUS]: statusFilters,
			[consultFields.CLINIC_NAME]: clinicFilters,
		}

		this.setState({
			toggleButtonValue,
			filteredValues,
			adminTitle,
		})
	}

	changeFilters = filteredValues => {
		this.setState({
			toggleButtonValue: '',
			adminTitle: adminPageTitles['default'],
			filteredValues,
		})
	}

  async refreshTable() {
		await this.props.getConsultations();
		// isLoading is VisitorTable useEffect dep
    this.setState({ isLoading: true });
  }

  loadingDone = () => {
    this.setState({ isLoading: false });
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
				value={this.state.toggleButtonValue}
			/>;
		}

		return (
			<>
				{toggleButtons}
				<Card.Body>
					<h1 className="h2">
						<Row>
							<Col className="col-8">
								{this.props.clinic === 'admin' ? this.state.adminTitle : 'Consultations Completed'}
							</Col>
							<Col className="col-4 text-right">
								<Button
									shape="round"
									icon={<ReloadOutlined />}
									size="small"
									onClick={this.refreshTable}
								>
									Refresh
                </Button>
							</Col>
						</Row>
					</h1>
					<ConsultationsTable
						clinic={clinic}
						filteredValues={this.state.filteredValues}
						changeFilters={this.changeFilters}
						inquirers={this.props.inquirers}
						lawyers={this.props.lawyers}
						lawTypes={this.props.lawTypes}
						consultations={this.props.consultations} // object
						updateConsultation={this.props.updateConsultation}
            isLoading={this.state.isLoading}
            loadingDone={this.loadingDone}
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
		getConsultations: () => dispatch(actions.getConsultations()),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Consultations)
