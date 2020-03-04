import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

// components
import ConsultationsTable from '../../components/clinics/consultationsTable/ConsultationsTable';
// data
import * as actions from '../../store/actions';
import styles from './Clinics.module.css';

class Consultations extends Component {

	onToggle = val => {
		console.log(val);
	}

	render() {

		let clinicToggleBtns = [];
		const settings = {
			referrals: { buttonLabel: 'Referral Eligible' },
			impact: { buttonLabel: 'High Impact' },
			all: { buttonLabel: 'All Consultations' },
		};
		for (var item in settings) {
			let key = item, value = settings[item];
			let toggleBtnStyles = {}
			toggleBtnStyles = {
				borderRight: "1px solid rgb(255, 255, 255, .5)",
				borderLeft: "1px solid rgb(255, 255, 255, .5)",
			}
			clinicToggleBtns.push(<ToggleButton key={key} value={key} className="btn-sm" style={toggleBtnStyles}>{value.buttonLabel}</ToggleButton>)
		}

		return (
			<>
				<ButtonToolbar className={styles.clinicToolbar}>
					<ToggleButtonGroup type="radio" name="options" onChange={this.onToggle}>
						{/* defaultValue="referrals" */}
						{clinicToggleBtns}
					</ToggleButtonGroup>
				</ButtonToolbar>
				<Card.Body>
					<h1 className="h2">Referrals</h1>
					<ConsultationsTable
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
