import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import styles from './Clinics.module.css';
import InquirerForm from './InquirerForm';

import * as actions from '../../store/actions'
import logo from '../../assets/images/logo.png';

class Clinics extends Component {
	componentDidMount() {
		this.props.getLawyers();
		this.props.getInquirers();
		this.props.getLawTypes();
		this.props.getClinicSettings();
	}

	onClinicToggle = val => {
		// console.log(this.props.clinicSettings)
		this.props.setCurrentClinic(val)
	}

	render() {
		let clinicTitle = '';
		if (this.props.clinicSettings && this.props.clinicSettings[this.props.currentClinic]) {
			clinicTitle = this.props.clinicSettings[this.props.currentClinic].title;
		}
		return (
			<>
				<Navbar bg="primary" variant="dark" className={styles.navBar}>
					<Navbar.Brand href="/">
						<img
							alt="LGBT Bar NY"
							src={logo}
							width="auto"
							height="30"
							className="d-inline-block align-top"
						/>&nbsp;&nbsp;&nbsp;{clinicTitle}
					</Navbar.Brand>
					<Navbar.Collapse className="justify-content-end">
						<Nav defaultActiveKey="/consultation">
							<Nav.Link href="/setup">Setup</Nav.Link>
							<Nav.Link href="/consultation" defaultChecked>Consultation</Nav.Link>
							<Nav.Link href="/referrals">Referrals</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<Container>
					<Card className={styles.cardContainer}>
						{/* Card.Header with top border */}
						<ButtonToolbar className={styles.clinicToolbar}>
							<ToggleButtonGroup type="radio" name="options" defaultValue="tuesday" onChange={this.onClinicToggle}>
								<ToggleButton value="tuesday" className="btn-sm">Tues Night Clinic</ToggleButton>
								<ToggleButton value="youth" className="btn-sm">Youth Qlinic</ToggleButton>
							</ToggleButtonGroup>
						</ButtonToolbar>
						<Card.Body>
							<Switch>
								<Route path="/consultation" component={InquirerForm} />
								<Redirect to="/consultation" />
							</Switch>
						</Card.Body>
					</Card>
				</Container>
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

const mapDispatchToProps = dispatch => {
	return {
		getLawyers: () => dispatch(actions.getLawyers()),
		getInquirers: () => dispatch(actions.getInquirers()),
		getLawTypes: () => dispatch(actions.getLawTypes()),
		getClinicSettings: () => dispatch(actions.getClinicSettings()),
		setCurrentClinic: clinic => dispatch(actions.setCurrentClinic(clinic))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Clinics);
