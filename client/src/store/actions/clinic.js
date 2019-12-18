import *  as actiionTypes from './actionTypes';
import axios from 'axios';

const clientSettingFile = './data/clinics.json';

// async action creators

export const getClinicSettings = () => {
	return dispatch => {
		axios.get(clientSettingFile)
		.then(res => res.data)
		.then(settings => {
			dispatch(setClinicSettings(settings));
		})
		.catch(err => console.log('ERR', err));
	}
}

// sync action creators

export const setClinicSettings = clinicSettings => {
	return {
		type: actiionTypes.SET_CLINIC_SETTINGS,
		clinicSettings,
	}
}

export const setCurrentClinic = currentClinic => {
	return {
		type: actiionTypes.SET_CURRENT_CLINIC,
		currentClinic,
	}
}
