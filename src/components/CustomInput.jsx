import React from 'react'
import { handleError } from '../utils/validationUtils';

export const CustomInput = ({

  label,
  value,
  name,
  handleChange,
  formLabel,
  ...otherProps
}) => {
  const isInvalid = handleError(name, value)
  return (
    <div className={`flex flex-col h-[105px] ${isInvalid ? 'border-red-400' : ''}`}>
      {
        formLabel ? formLabel : (
          <label className="m-0 text-[13px]">
            {label}
          </label>
        )
      }

      <input
        name={name}
        type="email"
        value={value}
        className={`h-[3rem] border ${isInvalid ? 'border-red-400' : 'border-gray-200'} focus:outline-none focus:${isInvalid ? 'border-red-400' : 'border-gray-800'} hover:${!isInvalid ? 'border-gray-200' : ''}`}
        onChange={e => {
          handleChange(e, name)
        }}
        {...otherProps}
      />
      {isInvalid && (
        <p className="self-end text-[13px] text-red-400">
          Email is required.
        </p>
      )}
    </div>
  )
}
