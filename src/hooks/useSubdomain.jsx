import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';

export const useSubdomain = () => {
  const [subdomain, setSubDomain] = useState(null);
  const [isSubdomainValid, setIsSubdomainValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const host = window.location.host; // gets the full domain of the app

    const arr = host.split('.').slice(0, host.includes('localhost') ? -1 : -2);
    if (arr.length > 0 && arr[0] !== 'www') setSubDomain(arr[0]);
  }, []);

  useEffect(() => {
    if (!subdomain) return;

    const checkSubdomain = async () => {
      const ref = query(
        collection(db, 'portals'),
        where('portalURL', '==', subdomain)
      );
      const snapshot = await getDocs(ref);
      if (!snapshot.empty) {
        setIsSubdomainValid(true);
      } else {
        setIsSubdomainValid(false);
      }
      setIsLoading(false);
    };
    checkSubdomain();
  }, [subdomain]);

  return {
    subdomain,
    isSubdomainValid,
    isLoading,
  };
};
