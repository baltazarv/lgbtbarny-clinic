import React from "react";
import classNames from "classnames";

const RadioButton = ({
  field: { name, value, onChange, onBlur },
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
        type="radio"
        value={id} // could be something else for output?
        checked={id === value}
        onChange={onChange}
        onBlur={onBlur}
        className={classNames("form-check-input")}
        {...props}
      />
      <label htmlFor={id} className={classNames("form-check-label")}>{label}</label>
    </div>
  );
};

export default RadioButton;
