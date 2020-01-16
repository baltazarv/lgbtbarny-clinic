import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import classNames from "classnames";
import { InputFeedback } from '../formElements';
import { reqAsterisk } from '../formElements';

class CheckboxGroup extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = event => {
    const target = event.currentTarget;
    let valueArray = [...this.props.value] || [];

    if (target.checked) {
      valueArray.push(target.id);
    } else {
      valueArray.splice(valueArray.indexOf(target.id), 1);
    }

    this.props.onChange(this.props.id, valueArray);
  };

  handleBlur = () => {
    // take care of touched
    this.props.onBlur(this.props.id, true);
  };

  render() {
    const {
			id,
			value,
			error,
			touched,
			label,
			className,
			children,
			required,
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

    return (
			<Form.Group controlId={id} className={classes}>
        <fieldset>
					{formLabel}{_reqAsterisk}
          {React.Children.map(children, child => {
            return React.cloneElement(child, {
              field: {
                value: value.includes(child.props.id),
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
