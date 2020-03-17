import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import ClinicNav from '../../components/clinics/ClinicNav';
import ClinicIndex from './index';
import Intake from './Intake';
import Visitors from './Visitors';
import Consultation from './Consultation';
import Consultations from './Consultations';
// import NoMatch from './NoMatch';
import * as actions from '../../store/actions';
// css & images
import styles from './Clinics.module.css';
import bgImageRedish from '../../assets/images/bg-redish.png';
import bgImageBluish from '../../assets/images/bg-bluish.png';
import bgImageGreenish from '../../assets/images/bg-greenish.png';
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

  componentWillUnmount() {
    // console.log('Clinics componentWillUnmount')
  }

  getClinicPath = () => {
    return this.props.location.pathname.split('/')[1];
  }

  getSection = () => {
    return this.props.location.pathname.split('/')[2];
  }

  getTitle = () => {
    let clinicTitle = 'Clinic';
    if (this.getClinicPath() === 'admin') clinicTitle = 'Clinic Administration';
    if (CLINICS[this.getClinicPath()]) clinicTitle = CLINICS[this.getClinicPath()].title;
    return clinicTitle;
  }

  setBgImageStyle = () => {
    let img = bgImageBluish; // section = 'consultations' || 'completed'
    const section = this.getSection();
    if (section === 'intake' || section === 'visitors') img = bgImageGreenish;
    if (this.getClinicPath() === 'admin') img = bgImageRedish;
    let imgStyle = {
      background: `url(${img}) repeat-x top center fixed`,
      backgroundSize: "auto 278px",
    }
    this.setState({
      bgImageStyle: imgStyle,
    })
  }

  /**
   * <Card>
   *   <ButtonToolbar />
   *   <Card.Body />
   * </Card>
   */

  renderIndex = () => <Card.Body>
    <ClinicIndex />
  </Card.Body>;

  renderIntake = () => <Card.Body>
    <Intake
      clinic={this.getClinicPath()}
    />
  </Card.Body>;

  renderVisitors = () => <Visitors
    clinic={this.getClinicPath()}
  />;

  renderConsultation = () => <Card.Body>
    <Consultation
      clinic={this.getClinicPath()}
      lawyers={this.props.lawyers}
      inquirers={this.props.inquirers}
      lawTypes={this.props.lawTypes}
      refreshLawyers={this.props.getLawyers}
      refreshInquirers={this.props.getInquirers}
    />
  </Card.Body>;

  renderConsultations = () => <Consultations
    clinic={this.getClinicPath()}
  />;


  render() {

    return (
      <>
        <div style={this.state.bgImageStyle}>
          <ClinicNav
            clinic={this.getClinicPath()}
            section={this.getSection()}
            clinicTitle={this.getTitle()}
          />
          <Container>
            <Card className={styles.cardContainer} style={{ border: 0 }}>

              <Switch>
                <Route exact path="/" render={() => this.renderIndex()} />

                {/* tnc */}
                <Route path="/tnc/intake" render={() => this.renderIntake()} />
                <Route path="/tnc/visitors" render={() => this.renderVisitors()} />
                <Route path="/tnc/consultation" render={() => this.renderConsultation()} />
                <Route path="/tnc/completed" render={() => this.renderConsultations()} />
                <Route path="/tnc">
                  <Redirect to="/tnc/intake" />
                </Route>

                {/* nj */}
                <Route path="/nj/intake" render={() => this.renderIntake()} />
                <Route path="/nj/visitors" render={() => this.renderVisitors()} />
                <Route path="/nj/completed" render={() => this.renderConsultations()} />
                <Route path="/nj">
                  <Redirect to="/nj/intake" />
                </Route>

                {/* youth */}
                <Route path="/youth/consultation" render={() => this.renderConsultation()} />
                <Route path="/youth/visitors" render={() => this.renderVisitors()} />
                <Route path="/youth/completed" render={() => this.renderConsultations()} />
                <Route path="/youth">
                  <Redirect to="/youth/consultation" />
                </Route>

                {/* admin */}
                <Route path="/admin/visitors" render={() => this.renderVisitors()} />
                <Route path="/admin/consultations" render={() => this.renderConsultations()} />
                <Route path="/admin">
                  <Redirect to="/admin/visitors" />
                </Route>

                <Route
                  render={() => this.renderIndex()}
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
