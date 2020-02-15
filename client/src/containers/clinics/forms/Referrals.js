import React, { Component } from 'react';
import { connect } from 'react-redux';
// components
import ReferralsTable from '../../../components/clinics/ReferralsTable';
// data
// TO DO: remove ajax funtction
// import { getReferralConsultations } from '../../../data/consultationData';

class Referrals extends Component {

	render() {
		return (
			<>
				<h1 className="h2" > Referrals </h1> <ReferralsTable
					inquirers={this.props.inquirers}
					lawyers={this.props.lawyers}
					lawTypes={this.props.lawTypes}
					consultations={this.props.consultations} // object
					// isLoading={this.state.tableIsLoading}
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

export default connect(mapStateToProps)(Referrals)