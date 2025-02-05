import React, { useState } from 'react';

const CustomSelect = ({
  name,
  value,
  options,
  label,
  errorMessage,
  handleChange,
}) => {
  const [text, setText] = useState('');

  const handleError = () => {
    if (!text) return false;
    let isError = true;
    isError = text === '' ? true : false;
    return isError;
  };

  return (
    <div className={`flex flex-col h-[105px] text-[13px] ${handleError(value) ? 'border-red-400' : ''}`}>
      <label className="text-[14px]">{label}</label>
      <select
        name={name}
        className={`bg-white border border-gray-200 ${handleError(value) ? 'border-red-400' : ''}`}
        id={value}
        onChange={e => {
          setText(e.target.value);
          handleChange(e);
        }}
      >
        <option value="" disabled hidden></option>
        {options.map(value => (
          <option key={value} style={{ color: 'black', background: 'white' }} value={value}>
            {value}
          </option>
        ))}
      </select>
      {handleError(value) && (
        <span className="text-red-500 self-end">
          {errorMessage} is required
        </span>
      )}
    </div>
  );
};

export default CustomSelect;