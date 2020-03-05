import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import ClinicNav from '../../components/clinics/ClinicNav';
import ClinicIndex from './index';
import Intake from './Intake';
import Consultation from './Consultation';
import Consultations from './Consultations';
// import NoMatch from './NoMatch';
import * as actions from '../../store/actions';
// css & images
import styles from './Clinics.module.css';
import bgImageIntake from '../../assets/images/bg-intake.png';
import bgImageConsult from '../../assets/images/bg-consultation.png';
import bgImageReferrals from '../../assets/images/bg-referrals.png';
// data
import { CLINICS } from '../../data/clinics';

class Clinics extends Component {
  state = {
    bgImageStyle: null,
  }

  async componentDidMount() {
    this.setBgImageStyle();
    this.props.getLawyers();
    this.props.getInquirers();
    this.props.getLawTypes();
    this.props.getConsultations();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.setBgImageStyle();
    }
  }

  getClinicPath = () => {
    return this.props.location.pathname.split('/')[1];
  }

  getSection = () => {
    return this.props.location.pathname.split('/')[2];
  }

  setBgImageStyle = () => {
    let img = bgImageConsult;
    const section = this.getSection();
    // if section === undefined ? ClinicIndex
    if (section === 'intake') {
      img = bgImageIntake
    } else if (section === 'completed') {
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

    let clinicTitle = 'Clinic Administration';
    if (CLINICS[this.getClinicPath()]) clinicTitle = CLINICS[this.getClinicPath()].title;

    /**
     * <Card>
     *   <ButtonToolbar />
     *   <Card.Body />
     * </Card>
     */

    const consult = () => <Card.Body>
      <Consultation
        clinicTitle={clinicTitle}
        lawyers={this.props.lawyers}
        inquirers={this.props.inquirers}
        lawTypes={this.props.lawTypes}
        refreshInquirers={this.props.getInquirers}
      />
    </Card.Body>

    const intake = () => <Card.Body>
      <Intake />
    </Card.Body>

    const consultations = () => <Consultations
      clinic={this.getClinicPath()}
    />

		const index = () => <Card.Body>
			<ClinicIndex />
		</Card.Body>

    return (
      <>
        <div style={this.state.bgImageStyle}>
          <ClinicNav
            clinic={this.getClinicPath()}
            section={this.getSection()}
            clinicTitle={clinicTitle}
          />
          <Container>
            <Card className={styles.cardContainer} style={{ border: 0 }}>

              <Switch>
                <Route exact path="/" component={index} />

                {/* tnc */}
                <Route path="/tnc/intake" component={intake} />
                <Route path="/tnc/consult" component={consult} />
                <Route path="/tnc/completed" component={consultations} />
                <Route path="/tnc">
                  <Redirect to="/tnc/intake" />
                </Route>

                {/* nj */}
                <Route path="/nj/intake" component={intake} />
                <Route path="/nj/completed" component={consultations} />
                <Route path="/nj">
                  <Redirect to="/nj/intake" />
                </Route>

                {/* youth */}
                <Route path="/youth/consult" component={consult} />
                <Route path="/youth/completed" component={consultations} />
                <Route path="/youth">
                  <Redirect to="/youth/consult" />
                </Route>

                {/* admin */}
                <Route path="/admin/referrals" component={consultations} />
                <Route path="/admin">
                  <Redirect to="/admin/referrals" />
                </Route>

                <Route
                  component={index}
                />
              </Switch>
            </Card>
          </Container>
        </div>
      </>
    )
  }
}

const mapStateToProps = state => {
  return {
    inquirers: state.people.inquirers,
    lawyers: state.people.lawyers,
    lawTypes: state.lawTypes.lawTypes,
    consultations: state.consultations.consultations,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getLawyers: () => dispatch(actions.getLawyers()),
    getInquirers: () => dispatch(actions.getInquirers()),
    getConsultations: () => dispatch(actions.getConsultations()),
    getLawTypes: () => dispatch(actions.getLawTypes()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Clinics));
