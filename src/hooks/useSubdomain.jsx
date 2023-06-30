import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';

export const useSubdomain = () => {
  const [subdomain, setSubDomain] = useState(null);
  const [customDomain, setCustomDomain] = useState(null);
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [portalData, setPortalData] = useState(null);

  useEffect(() => {
    const host = window.location.host; // gets the full domain of the app

    if (host.includes('.huehq.com')) {
      const arr = host.split('.').slice(0, -2);
      if (arr.length > 0 && arr[0] !== 'www') setSubDomain(arr[0]);
    } else if (host.includes('localhost')) {
      const arr = host.split('.').slice(0, -1);
      if (arr.length > 0 && arr[0] !== 'www') setSubDomain(arr[0]);
    } else {
      // This is a custom domain, not a subdomain
      setCustomDomain(host);
    }
  }, []);

  useEffect(() => {
    const checkDomain = async () => {
      let ref;

      if (subdomain) {
        ref = query(
          collection(db, 'portals'),
          where('portalURL', '==', subdomain)
        );
      } else if (customDomain) {
        ref = query(
          collection(db, 'portals'),
          where('customDomain', '==', customDomain)
        );
      }

      if (ref) {
        const snapshot = await getDocs(ref);
        if (!snapshot.empty) {
          setIsValid(true);
          setPortalData(snapshot.docs[0].data()); // save the portal data
        } else {
          setIsValid(false);
        }
        setIsLoading(false);
      }
    };

    if (subdomain || customDomain) {
      checkDomain();
    }
  }, [subdomain, customDomain]);

  return {
    domain: subdomain || customDomain,
    isValid,
    isLoading,
    portalData, // return the portal data
  };
};

