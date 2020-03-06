import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';
import VisitorsTable from '../../components/clinics/visitorsTable/VisitorsTable';
import ToggleButtons from '../../components/ToggleButtons';
// data
import * as actions from '../../store/actions';

class Visitors extends Component {
  state ={
    adminTitle: 'New Jersey Intake Visitors',
  }

  handleFilterBtnClick = val => {
    if (val === 'tnc') this.setState({ adminTitle: 'Tuesday Night Clinic Intake Visitors' })
    if (val === 'youth') this.setState({ adminTitle: 'Youth Qlinic Intake Visitors' })
  }

  render() {

    // from parent
    const {
      clinic
    } = this.props;

    let toggleButtons = null;
    if (clinic === 'admin') {
      const settings = {
        nj: { buttonLabel: 'NJ Clinic' },
        tnc: { buttonLabel: 'Tues Night Clinic' },
        youth: { buttonLabel: 'Youth Qlinic' },
      };
      toggleButtons = <ToggleButtons
        settings={settings}
        callback={this.handleFilterBtnClick}
      />;
    }

    return (
      <>
        {toggleButtons}
        <Card.Body>
          <h1 className="h2">{clinic === 'admin' ? this.state.adminTitle : 'Visitors Checked In'}</h1>
					<VisitorsTable
            clinic={clinic}
						inquirers={this.props.inquirers}
						lawTypes={this.props.lawTypes}
						consultations={this.props.consultations} // object
						lawyers={this.props.lawyers}
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

export default connect(mapStateToProps, mapDispatchToProps)(Visitors)
