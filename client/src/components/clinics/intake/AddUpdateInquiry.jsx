import React, { useState } from 'react'
import { useFormik } from 'formik'
import { useSelector } from 'react-redux'
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

const { Option } = AntSelect
const { TextArea } = Input

const AddUpdateInquiry = ({
  id,
  onHide,
  isSubmitting,
}) => {
  const lawTypesObject = useSelector((state) => state.lawTypes.lawTypesObject)
  const lawyersObject = useSelector((state) => state.people.lawyersObject)

  const validate = (values) => {
    const errors = {}
    if (!values?.[consultFields.TYPE]) {
			errors[consultFields.TYPE] = 'Input an inquiry type.';
    }
    if (!values?.[consultFields.LAWYERS]) {
			errors[consultFields.LAWYERS] = 'Enter yourself as coordinator.';
    }
    return errors
  }

  const formik = useFormik({
    initialValues: {

    },
    validate,
    onSubmit: (values) => {
      console.log('onSubmit', JSON.stringify(values, null, 2))
    }
  })

  const reqFieldsHaveValues = () => {
    return formik.values?.[consultFields.TYPE] && formik.values?.[consultFields.LAWYERS]?.length > 0
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
        className="mb-3"
      />

      {/* coordinator */}
      <Select
        name={consultFields.LAWYERS}
        options={getOptionsForPeople(lawyersObject)}
        label="Coordinator(s)"
        required={true}
        mode="multiple"
        value={formik.values[consultFields.LAWYERS]}
        onChange={values => formik.setFieldValue(consultFields.LAWYERS, values)}
        onBlur={() => formik.setFieldTouched(consultFields.LAWYERS, true)}
        touched={formik.touched[consultFields.LAWYERS]}
        error={formik.errors[consultFields.LAWYERS]}
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
      />

      <hr />

      {/* save */}
      <Row >
        <Col className="d-flex justify-content-end">
          <Button variant="secondary" className="m-1" onClick={onHide}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="m-1"
            disabled={isSubmitting || !reqFieldsHaveValues()}
          >
            Enter Inquiry
          </Button>
        </Col>
      </Row>
    </form>
  </>
}

export default AddUpdateInquiry