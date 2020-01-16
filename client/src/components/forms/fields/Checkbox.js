import React from "react";
import classNames from "classnames";
import { InputFeedback } from '../formElements';

const Checkbox = ({
	field: { name, value, onChange, onBlur },
	form: { errors, touched, setFieldValue },
	id,
	label,
	className,
	...props
}) => {
	return (
		<div className="form-check">
			<input
				name={name}
				id={id}
				type="checkbox"
				value={value}
				checked={value}
				onChange={onChange}
				onBlur={onBlur}
				className={classNames("form-check-input")}
			/>
			<label htmlFor={id} className={classNames(
				"form-check-label",
				className && className.label ? className.label : '',
			)}>{label}</label>
			{touched[name] && <InputFeedback error={errors[name]} />}
		</div>
	);
};

export default Checkbox;
