import { useState } from 'react';

export const useForm = (initialState) => {
    console.log({
        initialState
    })
    const [values, setValues] = useState(initialState);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setValues((prevValues) => ({
            ...prevValues,
            [name]: value,
        }));
    };

    const resetForm = () => {
        setValues(initialState);
    };

    return { values, handleChange, resetForm };
};