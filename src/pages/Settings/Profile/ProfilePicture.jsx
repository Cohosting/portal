import { Avatar, Box, Text } from '@chakra-ui/react';

export const ProfilePicture = ({ profileImageUrl, firstName, lastName }) => {
  console.log({
    profileImageUrl,
  });
  return (
    <Box mb={8} textAlign="center">
      <label htmlFor="fileInput">
        <Avatar
          bg={'black'}
          color={'white'}
          size="xl"
          name={firstName + ' ' + lastName}
          src={profileImageUrl}
          cursor="pointer"
        />
        {!profileImageUrl && (
          <Box mt={2}>
            <Text fontSize="lg" fontWeight="bold">
              {`${firstName} ${lastName}`}
            </Text>
          </Box>
        )}
      </label>
    </Box>
  );
};
