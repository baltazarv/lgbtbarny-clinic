import React, { Component } from 'react';
import { connect } from 'react-redux';
// components
import ConsultTable from '../../../components/clinics/ReferralsTable';
// data
import { getReferralConsultations } from '../../../data/consultationData';

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
		this.setState({
			consultations: results.payload,
		})
	}

	render() {
		return (
			<>
				<h1 className="h2">Referrals</h1>
				<ConsultTable
					consultations={this.state.consultations}
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
