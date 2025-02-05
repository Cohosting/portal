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
      <div className="flex flex-col my-5">
        <p className="text-2xl font-bold">
          Your domain: {domain}
          {isLoading && <span className="ml-3 animate-spin">🔄</span>}
        </p>
        <p>Your domain dns is not configured properly</p>
        <p>please check your dns settings</p>
        <p>
          Create a cName: Name would be <strong>{domain.split('.')[0]}</strong>{' '}
          and point it to <strong>cname.vercel-dns.com.</strong>{' '}
        </p>
      </div>
    );
  } else if (isMisconfigured === false && isDomainChecked) {
    return (
      <div>
        <p className="text-xl font-bold my-3">
          Your domain is properly configured!
          {isLoading && <span className="ml-3 animate-spin">🔄</span>}
        </p>
        <p>
          Your current domain: <strong>{domain}</strong>
        </p>
        <button className="my-3 bg-black text-white text-sm py-2 px-4">
          Delete
        </button>
      </div>
    );
  }
  if (!isDomainChecked) return <span className="my-3 animate-spin">🔄</span>;
};
