import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = ({ label, error, ...props }: InputProps) => {
  return (
    <div className="input-group">
      {label && <label htmlFor={props.id || props.name}>{label}</label>}
      <input {...props} id={props.id || props.name} />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};
