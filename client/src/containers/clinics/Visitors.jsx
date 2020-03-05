import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import ToggleButtons from '../../components/ToggleButtons';

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
        </Card.Body>
      </>
    )
  }
}

export default Visitors;
