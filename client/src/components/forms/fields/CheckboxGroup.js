/** If only one checkbox, return value is string,
 *  If more than one, return value is array.
 */
import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import classNames from "classnames";
import { InputFeedback } from '../formElements';
import { reqAsterisk } from '../formElements';

class CheckboxGroup extends Component {
  constructor(props) {
		super(props);

		let singleSelect = false;
		if(React.Children.count(this.props.children) < 2) {
			singleSelect = true;
		}
		this.state = {
			singleSelect,
		}
  }

	// children onChange > CheckboxGroup onChange
  handleChange = event => {
		const target = event.currentTarget;

		// also can do by setting a `this.props.singleSelect`
		if (this.state.singleSelect) {

			let stringValue = '';
			if (target.checked) {
				stringValue = target.id;
			} else {
				stringValue = '';
			}
			this.props.onChange(this.props.id, stringValue);

		} else {

			let valueArray = [...this.props.value] || [];
			if (target.checked) {
				valueArray.push(target.id);
			} else {
				valueArray.splice(valueArray.indexOf(target.id), 1);
			}
			this.props.onChange(this.props.id, valueArray);
		}
  };

  handleBlur = () => {
		// CheckboxGroup setFieldTouched(this.props.id, true)
    this.props.onBlur(this.props.id, true);
	};

	getValue = childId => {
		if (this.state.singleSelect) {
			if (this.props.value) return true;
			return false;
		}
		return this.props.value.includes(childId);
	}

  render() {
    const {
			id,
			value,
			error,
			touched,
			label,
			description,
			className,
			children,
			required,
			// singleSelect = false,
		} = this.props;

    const classes = classNames(
      "input-field",
      {
        "is-success": value || (!error && touched), // handle prefilled or user-filled
        "is-error": !!error && touched
      },
      className
		);

		let formLabel = null;
		if (label) formLabel = <Form.Label className="mb-1">{label}</Form.Label>

		let _reqAsterisk = <span className="hidden-sm-up">&nbsp;</span>;
		if (required) _reqAsterisk = reqAsterisk;

		let descText = null;
		if (description) descText = <div className="mb-2 small">{description}</div>

    return (
			<Form.Group controlId={id} className={classes}>
        <fieldset>
					{formLabel}{_reqAsterisk}
					{descText}
          {React.Children.map(children, child => {
            return React.cloneElement(child, {
              field: {
                value: this.getValue(child.props.id),
                onChange: this.handleChange,
                onBlur: this.handleBlur
							},
            });
          })}
          {touched && <InputFeedback error={error} />}
        </fieldset>
      </Form.Group>
    );
  }
}

export default CheckboxGroup;
