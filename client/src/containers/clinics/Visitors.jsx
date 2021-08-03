import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { Card, Row, Col } from 'react-bootstrap';

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
      isLoading: true,
    }
    this.refreshTable = this.refreshTable.bind(this);
  }

  getPageTitle = () => {
    let pageTitle = 'Visitors Entered';
    if (this.props.clinic === 'admin') pageTitle = this.state.adminTitle;
    if (this.props.clinic === 'tnc') pageTitle = 'Visitors Checked In';
    return pageTitle;
  }

  // button group only on admin route
  handleFilterBtnClick = val => {
    let toggleButtonValue = '';
    let clinicFilters = [];
    let adminTitle = adminPageTitles['default'];
    if (val === 'nj') {
      toggleButtonValue = 'nj';
      clinicFilters = [peopleFields.CLINIC_NJ];
      adminTitle = adminPageTitles['nj'];
    }
    if (val === 'tnc') {
      toggleButtonValue = 'tnc';
      clinicFilters = [peopleFields.CLINIC_TNC];
      adminTitle = adminPageTitles['tnc'];
    }
    if (val === 'youth') {
      toggleButtonValue = 'youth';
      clinicFilters = [peopleFields.CLINIC_YOUTH];
      adminTitle = adminPageTitles['youth'];
    }
    if (val === 'all') {
      toggleButtonValue = 'all';
    }
    this.setState({
      toggleButtonValue,
      filteredValues: { [peopleFields.CLINIC_NAME]: clinicFilters },
      adminTitle,
    })
  }

  changeFilters = filteredValues => {
    this.setState({
      toggleButtonValue: '',
      filteredValues,
      adminTitle: adminPageTitles['default'],
    })
  }

  async refreshTable() {
    console.log('refreshTable')
    await this.props.getInquirers();
    this.setState({ isLoading: true });
  }

  loadingDone = () => {
    this.setState({ isLoading: false });
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
        value={this.state.toggleButtonValue}
      />;
    }

    return (
      <>
        {toggleButtons}
        <Card.Body>
          <h1 className="h2">
            <Row>
              <Col className="col-8">
                {this.getPageTitle()}
              </Col>
              <Col className="col-4 text-right">
                <Button
                  // type="primary"
                  shape="round"
                  icon="reload"
                  size="small"
                  onClick={this.refreshTable}
                >
                  Refresh
                </Button>
              </Col>
            </Row>
          </h1>
          <VisitorsTable
            clinic={clinic}
            filteredValues={this.state.filteredValues}
            changeFilters={this.changeFilters}
            inquirers={this.props.inquirers}
            lawTypes={this.props.lawTypes}
            consultations={this.props.consultations} // object
            lawyers={this.props.lawyers}
            isLoading={this.state.isLoading}
            loadingDone={this.loadingDone}
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
    getInquirers: () => dispatch(actions.getInquirers()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Visitors)
