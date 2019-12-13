import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import styles from './Clinics.module.css';
import InquirerForm from '../InquirerForm';

class Clinics extends Component {
	render() {
		return (
			<>
				<Container>
					<Card className={styles.cardContainer}>
						<Card.Header></Card.Header>
						<Card.Body>

							<InquirerForm />

						</Card.Body>
					</Card>
				</Container>
			</>
		)
	}
}

export default Clinics;
