import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Select, Button, Tooltip } from 'antd'
import { Form, Row, Col } from 'react-bootstrap'
import { ReloadOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { reqAsterisk } from '../../forms/formElements'
import { getOptionsForPeople } from '../../../data/peopleData'

const VisitorSelect = ({
	visitorId,
	setVisitorId,
	// info,

	// refresh
	onRefresh,
	placeholder,
	loading = false,
}) => {
	const inquirersObject = useSelector((state) => state.people.inquirersObject)
	let [touched, setTouched] = useState(false)
	let [error, setError] = useState(null)

	const handleChange = (selection) => {
		setVisitorId(selection)
		setError(validate())
	}

	const handleBlur = (evt) => {
		setTouched(true)
		// onBlur(visitorId)
		setError(validate())
	}

	const validate = () => {
		let _error = ''
		if (!visitorId) _error = 'Select a repeat visitor to proceed. If not on pulldown, do not enter as repeat visitor';
		return _error
	}

	const labelTxtStyle = classNames({
		'text-muted': !visitorId,
	})

	let selectErrorClass = ''
	if (touched && error) selectErrorClass = 'has-error'

	return (
		<>
			<Form.Group as={Row} controlId="visitor" className="mb-0">
				<Form.Label column xs="12" sm="3" md="4" className="text-sm-right">
					{reqAsterisk}<span className={labelTxtStyle}>Repeat Visitor</span>
				</Form.Label>
				<Col xs="9" sm="7" md="6" className="align-self-center">
					<div className={selectErrorClass}>
						<Select
							showSearch
							style={{ width: '100%' }}
							placeholder={placeholder}
							loading={loading}
							value={visitorId}
							onChange={handleChange}
							onBlur={handleBlur}
							optionFilterProp="children"
							allowClear={true}
							autoFocus={true}
						>
							{getOptionsForPeople(inquirersObject)}
						</Select>
					</div>
				</Col>
				<Col xs="3" sm="2" className="justify-content-left align-self-center">
					<Tooltip title="refresh visitor info">
						<Button
							shape="circle"
							onClick={onRefresh}
							className="mr-3 pb-1"
							icon={<ReloadOutlined />}
						/>
					</Tooltip>
				</Col>
			</Form.Group>
			<Row>
				<Col
					sm={{ span: 10, offset: 1 }}
					lg={{ span: 14, offset: 3 }}
					xl={{ span: 16, offset: 4 }}
				>
					{error &&
						touched && (
							<div className="text-danger small">{error}</div>
						)}
				</Col>
			</Row>
		</>
	)
}

export default VisitorSelect
