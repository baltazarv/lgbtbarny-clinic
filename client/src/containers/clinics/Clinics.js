/**
 * Clinics >
 * * Intake >
 *   * Select
 *   * VisitorAddForm (create & update)
 * * Consultation > ConsultationForm >
 *   * FormModal > VisitorAddForm
 *   * FormModal > LawyerAddForm
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
// components
import { Route, Switch, Link, withRouter, Redirect } from 'react-router-dom';
import { Navbar, Nav, Container, Card, ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import Consultation from './Consultation';
import Intake from './Intake';
import Referrals from './Referrals';
// data
import * as actions from '../../store/actions';
// css & images
import styles from './Clinics.module.css';
import logo from '../../assets/images/logo.png';
import bgImageIntake from '../../assets/images/bg-intake.png';
import bgImageConsult from '../../assets/images/bg-consultation.png';
import bgImageReferrals from '../../assets/images/bg-referrals.png';

class Clinics extends Component {
	state = {
		bgImageStyle: null,
	}

	async componentDidMount() {
		this.setBgImageStyle();
		// return Promise that updates state
		this.props.getLawyers();
		this.props.getInquirers();
		this.props.getLawTypes(); // return Promise that updates state?
		this.props.getConsultations();
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
			consultRoute = <Route path="/consultation" render={() => {

				/*** Consultatin **/

				return <Consultation
					clinicTitle={clinicTitle}
					lawyers={this.props.lawyers}
					inquirers={this.props.inquirers}
					lawTypes={this.props.lawTypes}
					refreshInquirers={this.props.getInquirers}
				/>
			}}
			/>
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

			/*** Intake **/

			intakeRoute = <Route path="/intake" render={() => <Intake
				clinicTitle={clinicTitle}
			/>} />
		}

		let clinicToggleBtns = [];
		if (this.props.clinicSettings) {
			const settings = this.props.clinicSettings;
			for (var item in settings) {
				let key = item, value = settings[item];
				let style = {}
				style = {
					borderRight: "1px solid rgb(255, 255, 255, .5)",
					borderLeft: "1px solid rgb(255, 255, 255, .5)",
				}
				clinicToggleBtns.push(<ToggleButton key={key} value={key} className="btn-sm" style={style}>{value.buttonLabel}</ToggleButton>)
			}
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
						>
							{intakeNavLink}
							{consultNavLink}
							<Nav.Link as={Link} to="/referrals" eventKey="/referrals" >Referrals</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<Container>
					<Card className={styles.cardContainer} style={{border: 0}}>
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
									render={() => <Referrals
										clinicTitle={clinicTitle}
									/>}
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
		inquirers: state.people.inquirers,
		lawyers: state.people.lawyers,
		lawTypes: state.lawTypes.lawTypes,
		consultations: state.consultations.consultations,
		clinicSettings: state.clinics.clinicSettings,
		currentClinic: state.clinics.currentClinic,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		getLawyers: () => dispatch(actions.getLawyers()),
		getInquirers: () => dispatch(actions.getInquirers()),
		getConsultations: () => dispatch(actions.getConsultations()),
		getLawTypes: () => dispatch(actions.getLawTypes()),
		getClinicSettings: () => dispatch(actions.getClinicSettings()),
		setCurrentClinic: clinic => dispatch(actions.setCurrentClinic(clinic))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Clinics));
