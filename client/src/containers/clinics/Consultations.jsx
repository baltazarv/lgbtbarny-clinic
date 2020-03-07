import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';
// components
import ConsultationsTable from '../../components/clinics/consultationsTable/ConsultationsTable';
import ToggleButtons from '../../components/ToggleButtons';
// data
import * as actions from '../../store/actions';

class Consultations extends Component {

	handleFilterBtnClick = val => {
		console.log(val);
	}

	render() {

		// from parent
		const {
			clinic
		} = this.props;

		let toggleButtons = null;
		const settings = {
			impact: { buttonLabel: 'High Impact' },
			referrals: { buttonLabel: 'Referral Eligible' },
			all: { buttonLabel: 'All Consultations' },
		};
		toggleButtons = <ToggleButtons
			settings={settings}
			callback={this.handleFilterBtnClick}
		/>;

		return (
			<>
				{toggleButtons}
				<Card.Body>
					<h1 className="h2">{this.props.clinic === 'admin' ? 'Consultations' : 'Consultations Completed'}</h1>
					<ConsultationsTable
						clinic={clinic}
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
