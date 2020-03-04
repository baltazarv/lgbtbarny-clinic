import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import logo from '../../assets/images/logo.png';

const ClinicNav = (props) => {
  const {
    clinic,
    section,
    clinicTitle,
  } = props;

  return (
    <Navbar collapseOnSelect expand="sm" bg="primary" variant="dark">
       {/* className={styles.navBar} */}
      <Navbar.Brand>
        <img
          alt="LGBT Bar NY"
          src={logo}
          width="auto"
          height="30"
          className="d-inline-block align-top"
        />&nbsp;&nbsp;&nbsp;{clinicTitle}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="clinic-navbar-nav" />
      <Navbar.Collapse id="clinic-navbar-nav" className="justify-content-end">
        <Nav
          activeKey={section}
        >
          {(clinic === 'tnc' || clinic === 'nj') &&
            <Nav.Link as={Link} to={`/${clinic}/intake`} eventKey="intake" defaultChecked>Intake</Nav.Link>
          }
          {(clinic === 'tnc' || clinic === 'youth') &&
            <Nav.Link as={Link} to={`/${clinic}/consultation`} eventKey="consultation" >Consultation</Nav.Link>
          }
          {(clinic === 'tnc' || clinic === 'nj' || clinic === 'youth') &&
            <Nav.Link as={Link} to={`/${clinic}/referrals`} eventKey="referrals">Referrals</Nav.Link>
          }
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default withRouter(ClinicNav);
