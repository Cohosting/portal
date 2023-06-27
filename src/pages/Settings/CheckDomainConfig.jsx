import { Button, Flex, Heading, Spinner, Text } from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';

export const CheckDomainConfiguration = ({ defaultDomain }) => {
  const [domain, setDomain] = useState(defaultDomain); // change to your domain
  const [isMisconfigured, setIsMisconfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDomainChecked, setIsDomainChecked] = useState(false);
  useEffect(() => {
    const intervalId = setInterval(async () => {
      setIsLoading(true);
      const statusResponse = await fetch(
        `https://api.vercel.com/v6/domains/${domain}/config?teamId=team_X4iVsHVRDNhpdBRTph9ykl2S`,
        {
          headers: {
            Authorization: `Bearer gFbWyYR3oyt71Qx4f0VNkHon`,
          },
          method: 'GET',
        }
      );

      const statusData = await statusResponse.json();
      setIsMisconfigured(statusData.misconfigured);
      setIsLoading(false);

      if (!isDomainChecked) {
        setIsDomainChecked(true);
      }
    }, 5000); // 5 seconds

    // Clean up the interval when the component is unmounted or when the 'domain' dependency changes
    return () => clearInterval(intervalId);
  }, [domain]);

  if (isMisconfigured && isDomainChecked) {
    return (
      <Flex flexDir={'column'} my={5}>
        <Text fontSize={'26px'} fontWeight={700}>
          Your domain: {domain}
          {isLoading && <Spinner ml={3} />}
        </Text>
        <Text>Your domain dns is not configured properly</Text>
        <Text>please check your dns settings</Text>
        <Text>
          Create a cName: Name would be <strong>{domain.split('.')[0]}</strong>{' '}
          and point it to <strong>cname.vercel-dns.com.</strong>{' '}
        </Text>
      </Flex>
    );
  } else if (isMisconfigured === false && isDomainChecked) {
    return (
      <div>
        <Text fontSize={'24px'} fontWeight={'700'} my={3}>
          Your domain is properly configured!
          {isLoading && <Spinner ml={3} />}
        </Text>
        <Text>
          Your current domain: <strong>{domain}</strong>
        </Text>
        <Button my={3} bg={'black'} color={'white'} fontSize={'15px'}>
          Delete
        </Button>
      </div>
    );
  }
  if (!isDomainChecked) return <Spinner my={3} />;
};
