import React from 'react'
import { useFormik } from 'formik'
import { useSelector, useDispatch } from 'react-redux'
import { Select as AntSelect, Input, Divider } from 'antd'
import { Form, Row, Col, Button } from 'react-bootstrap'
import Select from '../../forms/fields/Select'
// constants
import * as consultFields from '../../../data/consultFields'
import { getOptionsForLawTypes } from '../../../data/lawTypeData'
import { getOptionsForPeople } from '../../../data/peopleData'
import {
  hotlineTypes,
  hotlineDispositions,
} from '../../../data/consultationData'
import {
  createConsultation,
  consultationCreated,
  updateConsultation, //-> dispatch(consultationUpdated(newConsultation))
} from '../../../store/actions'

const { Option } = AntSelect
const { TextArea } = Input

const AddUpdateInquiry = ({
  inquirer, // need id
  onHide,
  isSubmitting,
  setIsSubmitting,
  updateData, // update only
}) => {
  const dispatch = useDispatch()
  const lawTypesObject = useSelector((state) => state.lawTypes.lawTypesObject)
  const lawyersObject = useSelector((state) => state.people.lawyersObject)
  const consultations = useSelector((state) => state.consultations.consultations)

  const validate = (values) => {
    const errors = {}
    if (!values?.[consultFields.TYPE]) {
      errors[consultFields.TYPE] = 'Input an inquiry type.';
    }
    if (!values?.[consultFields.COORDINATOR] || values?.[consultFields.COORDINATOR]?.length === 0) {
      errors[consultFields.COORDINATOR] = 'Enter yourself as coordinator.';
    }
    return errors
  }

  const submitConsultation = async (values) => {
    try {
      setIsSubmitting(true)
      let payload = { ...values } // JSON.stringify(payload, null, 2)
      // disposition string to array
      if (values?.[consultFields.DISPOSITIONS] &&
        typeof values?.[consultFields.DISPOSITIONS] === 'string') {
        payload[consultFields.DISPOSITIONS] = [values[consultFields.DISPOSITIONS]]
      }

      let serverResponse = null
      if (updateData) {
        // UPDATE
        serverResponse = await dispatch(updateConsultation({
          id: updateData.key,
          fields: payload,
        }))
        if (serverResponse.status === 'success' && serverResponse.type === 'updateConsultation') {
          formik.resetForm()
          onHide()
          setIsSubmitting(false)
        } else {
          setIsSubmitting(false)
        }
      } else {
        // CREATE
        // inquirer id
        payload[consultFields.INQUIRERS] = [inquirer.id]
        // datetime stamp
        payload[consultFields.DATETIME] = new Date()
        // hard-code to NYC clinic for now
        payload[consultFields.CLINIC_NAME] = consultFields.CLINIC_TNC
        // hard-code status to "Hotline"
        payload[consultFields.STATUS] = consultFields.STATUS_HOTLINE

        serverResponse = await dispatch(createConsultation(payload))
        if (serverResponse.status === 'success' && serverResponse.type === 'createConsultation') {
          // adding to consultations local object
          // ...not adding to inquirers local object
          dispatch(consultationCreated(serverResponse.payload))
          formik.resetForm()
          onHide()
          setIsSubmitting(false)
        } else {
          setIsSubmitting(false)
        }
      }
    } catch (err) {
      console.log('submitConsultation error', err)
    }
  }

  const formik = useFormik({
    initialValues: (() => {
      let values = {}
      if (updateData) {
        const consult = consultations[updateData.key];
        [
          consultFields.TYPE,
          consultFields.COORDINATOR,
          consultFields.LAW_TYPES,
          consultFields.SITUATION,
          consultFields.DISPOSITIONS
        ].forEach((field) => {
          if (consult?.[field]) {
            values[field] = consult[field]
          }
        })
      }
      return values
    })(),
    validate,
    onSubmit: submitConsultation,
  })

  const reqFieldsHaveValues = () => {
    return formik.values?.[consultFields.TYPE] && formik.values?.[consultFields.COORDINATOR]?.length > 0
  }

  // console.log('formik', formik)

  const typeOptions = () => {
    return hotlineTypes.map((item) => {
      return <Option key={item} value={item}>
        {item}
      </Option>
    })
  }

  const dispoOptions = () => {
    return hotlineDispositions.map((item) => {
      return <Option key={item} value={item}>
        {item}
      </Option>
    })
  }

  return <>
    <form onSubmit={formik.handleSubmit}>

      {/* inquiry type */}
      <Select
        name={consultFields.TYPE}
        options={typeOptions()}
        label="Inquiry type"
        required={true}
        value={formik.values[consultFields.TYPE]}
        onChange={(value) => formik.setFieldValue(consultFields.TYPE, value)}
        onBlur={() => formik.setFieldTouched(consultFields.TYPE, true)}
        touched={formik.touched[consultFields.TYPE]}
        error={formik.errors[consultFields.TYPE]}
        disabled={isSubmitting}
        className="mb-3"
      />

      {/* coordinator */}
      <Select
        name={consultFields.COORDINATOR}
        // options taken from lawyers (+ coordinators)
        options={getOptionsForPeople(lawyersObject)}
        label="Coordinator(s)"
        required={true}
        mode="multiple"
        value={formik.values[consultFields.COORDINATOR]}
        onChange={values => formik.setFieldValue(consultFields.COORDINATOR, values)}
        onBlur={() => formik.setFieldTouched(consultFields.COORDINATOR, true)}
        touched={formik.touched[consultFields.COORDINATOR]}
        error={formik.errors[consultFields.COORDINATOR]}
        disabled={isSubmitting}
        className="mb-3"
      />

      {/* legal issues */}
      <Select
        name={consultFields.LAW_TYPES}
        options={getOptionsForLawTypes(lawTypesObject)}
        label="Legal issue(s)"
        mode="multiple"
        value={formik.values[consultFields.LAW_TYPES]}
        onChange={values => formik.setFieldValue(consultFields.LAW_TYPES, values)}
        onBlur={() => formik.setFieldTouched(consultFields.LAW_TYPES, true)}
        touched={formik.touched[consultFields.LAW_TYPES]}
        error={formik.errors[consultFields.LAW_TYPES]}
        disabled={isSubmitting}
        className="mb-3"
      />

      {/* notes */}
      <Form.Group
        as={Row}
        controlId={consultFields.SITUATION}
        label="Notes"
        className="mb-3"
      >
        <Form.Label column sm={4} className="text-sm-right">
          <span>Notes</span>
        </Form.Label>
        <Col sm={8}>
          <TextArea rows={2}
            onChange={(evt) => formik.setFieldValue(consultFields.SITUATION, evt.target.value)}
            defaultValue={updateData && updateData?.[consultFields.SITUATION] ? updateData[consultFields.SITUATION] : ''}
            disabled={isSubmitting}
          />
        </Col>
      </Form.Group>

      <Divider />

      {/* disposition */}
      <Select
        name={consultFields.DISPOSITIONS}
        options={dispoOptions()}
        label="Disposition"
        required={false}
        value={formik.values[consultFields.DISPOSITIONS]}
        onChange={(value) => formik.setFieldValue(consultFields.DISPOSITIONS, value)}
        onBlur={() => formik.setFieldTouched(consultFields.DISPOSITIONS, true)}
        touched={formik.touched[consultFields.DISPOSITIONS]}
        error={formik.errors[consultFields.DISPOSITIONS]}
        disabled={isSubmitting}
      />

      <hr />

      {/* save */}
      <Row >
        <Col className="d-flex justify-content-end">
          <Button
            variant="secondary"
            className="m-1" onClick={onHide}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="m-1"
            disabled={isSubmitting || !reqFieldsHaveValues()}
          >
            {updateData ? 'Update' : 'Enter'} Inquiry
          </Button>
        </Col>
      </Row>
    </form>
  </>
}

export default AddUpdateInquiry