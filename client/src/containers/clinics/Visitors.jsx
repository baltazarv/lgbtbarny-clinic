import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card } from 'react-bootstrap';
import VisitorsTable from '../../components/clinics/visitorsTable/VisitorsTable';
import ToggleButtons from '../../components/ToggleButtons';
// data
import * as actions from '../../store/actions';
import * as peopleFields from '../../data/peopleFields';

const adminPageTitles = {
  default: 'Clinic Visitors',
  nj: 'NJ Clinic Visitors',
  tnc: 'Tuesday Night Clinic Visitors',
  youth: 'Youth Qlinic Visitors',
};

class Visitors extends Component {

	constructor(props) {
		super(props);
		let filteredValues = [];
		if (this.props.clinic === 'admin') {
			filteredValues = {
        [peopleFields.CLINIC_NAME]: [peopleFields.CLINIC_NJ],
      }
		}
		this.state = {
			adminTitle: adminPageTitles['nj'],
			filteredValues,
		}
  }

  getPageTitle = () => {
    let pageTitle = 'Visitors Entered';
    if (this.props.clinic === 'admin') pageTitle = this.state.adminTitle;
    if (this.props.clinic === 'tnc') pageTitle = 'Visitors Checked In';
    return pageTitle;
  }

  // button group only on admin route
  handleFilterBtnClick = val => {
    let clinicFilters = [];
    let adminTitle = adminPageTitles['default'];
    if (val === 'nj') {
      clinicFilters = [peopleFields.CLINIC_NJ];
      adminTitle = adminPageTitles['nj'];
    }
    if (val === 'tnc') {
      clinicFilters = [peopleFields.CLINIC_TNC];
      adminTitle = adminPageTitles['tnc'];
    }
    if (val === 'youth') {
      clinicFilters = [peopleFields.CLINIC_YOUTH];
      adminTitle = adminPageTitles['youth'];
    }
    this.setState({
      filteredValues: { [peopleFields.CLINIC_NAME]: clinicFilters },
      adminTitle,
    })
  }

  changeFilters = filteredValues => {
    this.setState({
      filteredValues,
      adminTitle: adminPageTitles['default'],
    })
  }

  render() {
    // from parent
    const {
      clinic,
    } = this.props;

    let toggleButtons = null;
    if (clinic === 'admin') {
      const settings = {
        nj: { buttonLabel: 'NJ Clinic' },
        youth: { buttonLabel: 'Youth Qlinic' },
        tnc: { buttonLabel: 'Tues Night Clinic' },
        all: { buttonLabel: 'All Clinics' },
      };
      toggleButtons = <ToggleButtons
        defaultValue="nj"
        settings={settings}
        callback={this.handleFilterBtnClick}
      />;
    }

    return (
      <>
        {toggleButtons}
        <Card.Body>
          <h1 className="h2">{this.getPageTitle()}</h1>
          <VisitorsTable
            clinic={clinic}
            filteredValues={this.state.filteredValues}
            changeFilters={this.changeFilters}
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
