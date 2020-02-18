import React, { Component } from 'react';
import { connect } from 'react-redux';
// components
import ReferralsTable from '../../../components/clinics/ReferralsTable';
// data
import * as actions from '../../../store/actions';

class Referrals extends Component {

	render() {
		return (
			<>
				<h1 className="h2" > Referrals </h1>
				<ReferralsTable
					inquirers={this.props.inquirers}
					lawyers={this.props.lawyers}
					lawTypes={this.props.lawTypes}
					consultations={this.props.consultations} // object
					updateConsultation={this.props.updateConsultation}
				/>
			</>
		)
	}
}

const mapStateToProps = state => {
	return {
		inquirers: state.people.inquirersObject,
		lawyers: state.people.lawyersObject,
		lawTypes: state.lawTypes.lawTypesObject,
		clinicSettings: state.clinics.clinicSettings,
		currentClinic: state.clinics.currentClinic,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateConsultation: updateObject => dispatch(actions.updateConsultation(updateObject)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Referrals)