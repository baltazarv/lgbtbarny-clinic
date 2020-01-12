import React, { Component } from 'react'
import { connect } from 'react-redux'

class ReferralsForm extends Component {
	render() {

		return (
			<>
				<h1 className="h1"><span className="font-italic">{this.props.clinicTitle}</span> Referrals</h1>
				Referrals
			</>
		)
	}
}

const mapStateToProps = state => {
	return {
		clinicSettings: state.clinics.clinicSettings,
		currentClinic: state.clinics.currentClinic,
	}
}

export default connect(mapStateToProps)(ReferralsForm)
