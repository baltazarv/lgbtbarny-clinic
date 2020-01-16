import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route, Switch, Link, withRouter, Redirect } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

import styles from './Clinics.module.css';
import ConsultationForm from './forms/ConsultationForm';
import Intake from './forms/Intake';
import Referrals from './forms/Referrals';

import * as actions from '../../store/actions'
import logo from '../../assets/images/logo.png';
import bgImageIntake from '../../assets/images/bg-intake.png';
import bgImageConsult from '../../assets/images/bg-consultation.png';
import bgImageReferrals from '../../assets/images/bg-referrals.png';

class Clinics extends Component {
	state = {
		bgImageStyle: null,
	}

	componentDidMount() {
		this.setBgImageStyle();
		this.props.getLawyers();
		this.props.getInquirers();
		this.props.getLawTypes();
		this.props.getClinicSettings();
	}

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setBgImageStyle();
    }
	}

	onClinicToggle = val => {
		this.props.setCurrentClinic(val)
	}

	setBgImageStyle = () => {
		let img = bgImageConsult;
		const pathname = this.props.location.pathname;
		if (pathname === '/intake') {
			img = bgImageIntake
		} else if (pathname === '/referrals') {
			img = bgImageReferrals;
		}
		let imgStyle = {
			background: `url(${img}) repeat-x top center fixed`,
			backgroundSize: "auto 278px",
		}
		this.setState({
			bgImageStyle: imgStyle,
		})
	}

	render() {
		let clinicTitle = '';
		if (this.props.clinicSettings && this.props.clinicSettings[this.props.currentClinic]) {
			clinicTitle = this.props.clinicSettings[this.props.currentClinic].title;
		}

		let redirectRoute = <Redirect path="/" to="/intake" />

		// jersey clinic students cannot do consultations, intake only
		let consultNavLink = null;
		let consultRoute = null;
		if (this.props.currentClinic !== 'nj') {
			consultNavLink = <Nav.Link as={Link} to="/consultation" eventKey="/consultation" >Consultation</Nav.Link>
			consultRoute = <Route path="/consultation" render={() => <ConsultationForm clinicTitle={clinicTitle} />} />
		}

		// youth clinics do intake & consultation at same time
		if (this.props.currentClinic === 'youth') {
			redirectRoute = <Redirect path="/"
				to="/consultation" />
		}
		let intakeNavLink = null;
		let intakeRoute = null;
		if (this.props.currentClinic !== 'youth') {
			intakeNavLink = <Nav.Link as={Link} to="/intake" eventKey="/intake" defaultChecked>Intake</Nav.Link>
			intakeRoute = <Route path="/intake" render={() => <Intake clinicTitle={clinicTitle} />} />
		}

		let clinicToggleBtns = null;
		if (this.props.clinicSettings) {
			clinicToggleBtns = Object.entries(this.props.clinicSettings).map((clinic, index) => {
				let key = clinic[0], value = clinic[1];
				let style = {}
				if (index !== 2) {
					style = {
						borderRight: "1px solid rgb(255, 255, 255, .5)",
						borderLeft: "1px solid rgb(255, 255, 255, .5)",
					}
				}
				return <ToggleButton key={index} value={key} className="btn-sm" style={style}>{value.buttonLabel}</ToggleButton>
			})
		}

		return (
			<div style={this.state.bgImageStyle}>
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
						<Nav
							activeKey={this.props.location.pathname}
						// defaultActiveKey="intake"
						// onSelect={selectKey => console.log(selectKey)}
						>
							{intakeNavLink}
							{consultNavLink}
							<Nav.Link as={Link} to="/referrals" eventKey="/referrals" >Referrals</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<Container>
					<Card className={styles.cardContainer}>
						{/* Card.Header with top border */}
						<ButtonToolbar className={styles.clinicToolbar}>
							<ToggleButtonGroup type="radio" name="options" defaultValue="tuesday" onChange={this.onClinicToggle}>
								{clinicToggleBtns}
							</ToggleButtonGroup>
						</ButtonToolbar>
						<Card.Body>
							<Switch>
								{intakeRoute}
								{consultRoute}
								<Route
									path="/referrals"
									render={() => <Referrals clinicTitle={clinicTitle} />}
								/>
								{redirectRoute}
							</Switch>
						</Card.Body>
					</Card>
				</Container>
			</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Clinics));
