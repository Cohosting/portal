import React from 'react';
import { Input, Flex, Button, Text, FormLabel } from '@chakra-ui/react';
import { FaCheckCircle } from 'react-icons/fa';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { handleError, handlePortalURLValidation } from '../utils/formValidation';
import useSignupContext from '../context/SignupContext';

const inputStyle = {
    border: '1px solid #eee',
    _invalid: { borderColor: '#FC8181', boxShadow: 'none' },
};

const PortalURLInput = ({ value, handleChange }) => {

    const { portalURLValidation, setPortalURLValidation, personalInfoStep } = useSignupContext()

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

                    onChange={e => {
                        handleChange(e.target.value);
                        handlePortalURLValidation(e.target.value, setPortalURLValidation);

                    }}
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
