import React, { useContext, useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Flex,
  Text,
  FormErrorMessage,
} from '@chakra-ui/react';
import { PortalContext } from '../../context/portalContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export const CustomDomainForm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [domain, setDomain] = useState('');
  const [provider, setProvider] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const { portal } = useContext(PortalContext);
  const [error, setError] = useState({ domain: '', subdomain: '' });
  const [isLoading, setIsLoading] = useState(false);

  const providers = [
    'GoDaddy',
    'Google Domains',
    'Namecheap',
    'Bluehost',
    'HostGator',
    'Network Solutions',
  ];

  const isValidDomain = domain => {
    // a simple domain validation check
    return /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(domain);
  };

  const isValidSubdomain = subdomain => {
    // Check length
    if (subdomain.length > 63 || subdomain.length < 1) {
      return false;
    }

    // Check valid characters
    if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(subdomain)) {
      return false;
    }

    return true;
  };

  const handleSubmit = async event => {
    event.preventDefault();

    let errorObj = {};

    // Validate domain
    if (!isValidDomain(domain)) {
      errorObj = {
        ...errorObj,
        domain: 'Domain is not valid. Please enter a valid domain.',
      };
    }

    // Validate subdomain
    if (!isValidSubdomain(subdomain)) {
      errorObj = {
        ...errorObj,
        subdomain:
          'Subdomain is not valid. It must be 1-63 characters long, and can contain alphanumeric characters and hyphens, but cannot start or end with a hyphen.',
      };
    }

    if (Object.keys(errorObj).length > 0) {
      setError(errorObj);
      return;
    }
    setIsLoading(true);

    // If validation passes, process the data and save it
    let dom = domain.toLowerCase().trim();

    // Remove "http://" or "https://" if present
    if (dom.startsWith('http://')) {
      dom = dom.substring(7);
    } else if (dom.startsWith('https://')) {
      dom = dom.substring(8);
    }

    // Remove "www." if present, regardless of where it appears
    if (dom.includes('www.')) {
      dom = dom.replace('www.', '');
    }

    // Do the same for subdomain
    let subdom = subdomain.toLowerCase().trim();

    try {
      // Then, save the cleaned and formatted data
      const ref = doc(db, 'portals', portal.id);
      await updateDoc(ref, {
        customDomain: `${subdom}.${dom}`,
        settings: {
          ...portal.settings,
          domain: dom,
          provider,
          subdomain: subdom,
          customDomain: `${subdom}.${dom}`, // constructed FQDN
        },
      });
      const response = await fetch(
        'https://api.vercel.com/v10/projects/portal/domains?teamId=team_X4iVsHVRDNhpdBRTph9ykl2S',
        {
          body: JSON.stringify({
            name: `${subdom}.${dom}`,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer gFbWyYR3oyt71Qx4f0VNkHon`,
          },
          method: 'POST',
        }
      );

      const data = await response.json();

      console.log(data);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      console.log('Error updating portal setting', err);
    }

    onClose();
    setIsConfirmationOpen(true);
  };

  return (
    <>
      <Flex flexDir={'column'} my={5}>
        <Text fontSize={'15px'} fontWeight={500}>
          {' '}
          Portal domain
        </Text>
        <Text fontWeight={600} py={2}>
          {' '}
          Customize the domain used when clients visit your portal.{' '}
        </Text>

        <Button
          fontSize={'15px'}
          bg={'black'}
          color={'white'}
          w={'min-content'}
          onClick={onOpen}
        >
          Connect Custom Domain
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Connect a Custom Domain</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired isInvalid={!!error.domain}>
              <FormLabel>Domain name</FormLabel>
              <Input
                placeholder="Your domain"
                value={domain}
                onChange={e => {
                  setDomain(e.target.value);
                  if (error.domain) setError(prev => ({ ...prev, domain: '' }));
                }}
              />
              <FormErrorMessage>{error.domain}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired mt={4}>
              <FormLabel>Domain Provider</FormLabel>
              <Select
                placeholder="Select option"
                value={provider}
                onChange={e => setProvider(e.target.value)}
              >
                {providers.map(provider => (
                  <option key={provider} value={provider}>
                    {provider}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl isRequired isInvalid={!!error.subdomain} mt={4}>
              <FormLabel>Subdomain</FormLabel>
              <Input
                placeholder="Subdomain"
                value={subdomain}
                onChange={e => {
                  setSubdomain(e.target.value);
                  if (error.subdomain)
                    setError(prev => ({ ...prev, subdomain: '' }));
                }}
              />
              <FormErrorMessage>{error.subdomain}</FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={isLoading}
              colorScheme="blue"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Connect Your Domain</AlertDialogHeader>
            <AlertDialogBody>
              <p>
                Thank you! Now, please follow these steps to set up your custom
                domain:
              </p>
              <ol>
                <li>Log in to your {provider} account.</li>
                <li>Navigate to the DNS settings page for {domain}.</li>
                <li>Create a new CNAME record.</li>
                <li>
                  Set the 'Host' or 'Name' field to {subdomain}, and the 'Points
                  to' field to 'your-service-address.com'.
                </li>
                <li>
                  Save your changes. Please note that it can take anywhere from
                  a few minutes to 48 hours for these changes to propagate
                  across the internet.
                </li>
              </ol>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button onClick={() => setIsConfirmationOpen(false)}>
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {/* ...remaining code for AlertDialog and closing tags */}
    </>
  );
};
