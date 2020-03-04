import React from 'react';
import { Link } from 'react-router-dom';
import { CLINICS } from '../../data/clinics';

const ClinicIndex = () => {

  const getClinicName = (name) => {
    return CLINICS[name].title;
  }

  return (
    <>
      {<ul>
        <li><Link to="/tnc">{getClinicName('tnc')}</Link></li>
        <li><Link to="/nj">{getClinicName('nj')}</Link></li>
        <li><Link to="/youth">{getClinicName('youth')}</Link></li>
      </ul>}
    </>
  )
}

export default ClinicIndex;
