/**
 * Props for react-select:
 * * option: { value: 'xxx', label: 'Baltazar Villegas' }
 * * isMulti
 *
 * For react-select async option loading, import AsyncSelect from react-select/lib/Async or the AsyncCreatable -- can then use loadOptions, defaultOptions, cacheOptions props.
 *
 * Props for fornik:
 *  * name: fornik name
 *
 * Props for component functionality:
 *  * onChange: func to call when handle change
 *  * disabled: to add *
 *  * label: to add field label
 *  *
 */
import React, { Component } from 'react';
import Select from 'react-select';
import { Form, Row, Col } from 'react-bootstrap';
// import { ErrorMessage } from 'formik';
import { reqAsterisk } from '../formElements';

class SelectField extends Component {

	handleChange = value => {
		// formik.setFieldValue('name', value)
		this.props.onChange(this.props.name, value);
	};

	handleBlur = () => {
		// formik.setFieldTouched('name', value)
		this.props.onBlur(this.props.name, true);
	};

	render() {
		// custom props to pass to react-select props
		const { options, isMulti, isDisabled } = this.props;

		let _reqAsterisk = <span className="hidden-sm-up">&nbsp;</span>;
		if (this.props.required) {
			_reqAsterisk = reqAsterisk;
		}

		let formLabel = null;
		let selectColSize = 12;
		if (this.props.label) {
			formLabel = (<Form.Label column sm={3} className="text-md-right">
				{_reqAsterisk}{this.props.label}
			</Form.Label>);
			selectColSize = 9;
		}

		let style = {
			// ...style,
			group: {
				color: "#000",
			}
		}
		if (isDisabled) {
			style.group = {
				color: "rgb(0, 0, 0, .4)",
			}
		}


		return (
			<>
				<Form.Group as={Row} controlId={this.props.name} className="mb-0" style={style.group}>
					{formLabel}
					<Col sm={selectColSize}>
						<Select
							isMulti={isMulti}
							options={options}
							onChange={this.handleChange}
							onBlur={this.handleBlur}
							value={this.props.value}
							isClearable
						// isDisabled={isDisabled}
						/>
						{!!this.props.error &&
							this.props.touched && (
								<div className="text-danger small">{this.props.error}</div>
							)}
						{/* <ErrorMessage name={this.props.name} component="div" className="text-danger small" /> */}
					</Col>
				</Form.Group>
			</>
		);
	}
}

export default SelectField;
