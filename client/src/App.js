import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import InquirerForm from './containers/InquirerForm/index';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

import logo from './assets/images/logo.png';

class App extends React.Component {

	// test server
	constructor(props) {
		super(props);
		this.state = {
			testResponse: "",
		}
	}

	componentDidMount() {
		this.getTestResponse()
			.then(testResponse => this.setState({ testResponse }))
			.catch(err => console.log('ERR', err));
	}

	getTestResponse = async () => {
		const resp = await fetch('/api/ping');
		const body = await resp.json();
		if (resp.status !== 200) throw Error(body.message);
		return body;
	}


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
						/>{' Clinic Forms'} {this.state.testResponse}
					</Navbar.Brand>
					<Navbar.Collapse className="justify-content-end">
						<Nav>
							<Nav.Link href="/intake">Intake</Nav.Link>
							<Nav.Link href="/consultation">Consultation</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<Switch>
					<Route path="/consultation" component={InquirerForm} />
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
