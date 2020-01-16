import React from 'react';
import classNames from "classnames";

export const reqAsterisk = <span className="text-danger">*</span>;

export const InputFeedback = ({ error }) => error ? <div className="text-danger small">{error}</div> : null;
