import React from 'react'

import InputField from './../InputField'

const TextInputField = ({
    brandName,
    handleUpdateState
}) => {
    console.log({ brandName })

    return (
        <div className="flex flex-col">


            <InputField
                value={brandName}
                name={'brandName'}
                handleChange={e => handleUpdateState('brandName', e.target.value)}
                placeholder={'Brand name'}
            />
            <p className="text-right mt-1 text-sm">
                {!brandName ? 0 : brandName.length} of 30 characters used.
            </p>
        </div>
    )
}

export default TextInputField