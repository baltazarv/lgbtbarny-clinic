import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import Clinics from './containers/clinics/';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import logo from './assets/images/logo.png';

class App extends React.Component {

	render() {
		return (
			<>
				<Navbar bg="primary" variant="dark">
					<Navbar.Brand href="/">
						<img
							alt="LGBT Bar NY"
							src={logo}
							width="auto"
							height="30"
							className="d-inline-block align-top"
						/>{' Clinic Forms'}
					</Navbar.Brand>
					<Navbar.Collapse className="justify-content-end">
						<Nav>
							<Nav.Link href="/intake">Intake</Nav.Link>
							<Nav.Link href="/consultation">Consultation</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<Switch>
					<Route path="/consultation" component={Clinics} />
					<Redirect to="/consultation" />
				</Switch>
			</>
		);
	}
}

const mapStateToProps = state => {
	return {
	}
}

const mapDispatchToProps = dispatch => {
	return {
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
