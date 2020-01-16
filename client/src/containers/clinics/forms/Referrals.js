import React, { Component } from 'react';
import { connect } from 'react-redux';

class Referrals extends Component {
	render() {

		return (
			<>
				<h1 className="h2"><span className="font-italic">{this.props.clinicTitle}</span> Referrals</h1>
				Coming soon...
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

export default connect(mapStateToProps)(Referrals)
