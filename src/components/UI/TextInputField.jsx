import { Box, Input, Text } from '@chakra-ui/react'
import React from 'react'

import InputField from './../InputField'

const TextInputField = ({
    brandName,
    handleUpdateState
}) => {

    return (
        <Box>
            {/*             <Input
                value={brandName}
                onChange={e => handleUpdateState('brandName', e.target.value)}
                placeholder={'Brand name'}
            /> */}

            <InputField
                value={brandName}
                name={'brand_name'}
                onChange={e => handleUpdateState('brand_name', e.target.value)}
                placeholder={'Brand name'}
            />
            <Text textAlign={'right'} fontSize={'14px'}>
                {!brandName ? 0 : brandName.length} of 30 characters used.
            </Text>
        </Box>
    )
}

export default TextInputField