import React, { useCallback } from 'react';
import { Input, Flex, Button, Text, FormLabel } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';

import { handleError, } from '../utils/formValidation';
import { setPersonalInfoStep } from '../store/slices/authSlice';
import { validatePortalURL } from '../store/thunk/authThunks';

import _ from 'lodash'

const inputStyle = {
    border: '1px solid #eee',
    _invalid: { borderColor: '#FC8181', boxShadow: 'none' },
};

const PortalURLInput = ({ value, handleChange }) => {
    const dispatch = useDispatch();
    const { portalURLValidation, personalInfoStep } = useSelector((state) => state.auth);

    const debounceValidateURL = useCallback(_.debounce((url) => {
        dispatch(validatePortalURL(url));
    }, 500), [dispatch]);

    const handleURLChange = (url) => {
        handleChange(url);
        dispatch(setPersonalInfoStep({
            ...personalInfoStep,
            portalURL: url,
        }));
        debounceValidateURL(url);
    };

    return (
        <>
            <FormLabel>
                Portal URL - <Text as="span" fontSize={'13px'} color="#6B6F76">You can connect a custom domain later</Text>
            </FormLabel>
            <Flex align="center">
                <Input
                    type="text"
                    height={'3rem'}
                    width={'70%'}
                    textAlign={'right'}
                    placeholder=""
                    id={value}
                    sx={{
                        ...inputStyle,
                        _hover: !handleError() && { border: '1px solid #eee' },
                        _focus: !handleError()
                            ? { border: '1px solid rgb(33, 43, 54)', boxShadow: 'none' }
                            : { border: '1px solid #FC8181', boxShadow: 'none' },
                    }}
                    value={personalInfoStep.portalURL}
                    onChange={(e) => handleURLChange(e.target.value)}
                />
                <Text as={'span'}>.copilot.app</Text>
                <Button isLoading={portalURLValidation.isChecking}>
                    {portalURLValidation.isAvailable ? (
                        <FaCheckCircle color="green" fontSize={'1.2rem'} />
                    ) : !portalURLValidation.isChecking ? (
                        <AiOutlineCloseCircle color="red" fontSize={'1.2rem'} />
                    ) : null}
                </Button>
            </Flex>
        </>
    );
};

export default PortalURLInput;
