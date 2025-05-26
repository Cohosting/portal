import React, { useState, useEffect } from 'react';
import { RefreshCw, ExternalLink } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';

export const DomainConfiguration = ({ defaultDomain  , setShowUpdate }) => {
  const [domain, setDomain] = useState(defaultDomain);
  const [isMisconfigured, setIsMisconfigured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDomainChecked, setIsDomainChecked] = useState(false);

  const fetchDomainStatus = async () => {
    setIsLoading(true);

    try {
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
    } catch (error) {
      console.error('Error checking domain configuration:', error);
      // Optionally, you could set isMisconfigured to true to show a warning on errors
    }

    setIsLoading(false);
    setIsDomainChecked(true);
  };

  // Polling every 5 seconds
  useEffect(() => {
    fetchDomainStatus(); // initial call

    const intervalId = setInterval(() => {
      fetchDomainStatus();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [domain]);

  const handleRefresh = () => {
    fetchDomainStatus();
  };
 

  return (
    <div className="mb-6">
      <SectionHeader
        heading="Domain Configuration"
        description="Manage your custom domain settings."
        hideButton
      />
      {
        !domain ? (
          <div className="mt-5">
            <Button variant="outline" className='bg-black and text-white' onClick={() => setShowUpdate(true)}>
              Set up a custom domain
            </Button>
          </div>
        ) : <>
        <div className="flex items-center mt-4 justify-between mb-3">
        <h2 className="text-lg font-medium">Your domain: {domain}</h2>
        <a 
          href={`https://${domain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-blue-600"
        >
          Visit Website <ExternalLink className="ml-1 h-4 w-4" />
        </a>
      </div>

      {isDomainChecked && isMisconfigured ? (
        <div className="mb-5 bg-gray-50 border border-gray-200 rounded p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div className="ml-3 w-full">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-800">Domain Configuration Issue</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Warning
                </span>
              </div>
              <div className="mt-2 text-sm text-gray-700">
                <p>Your domain DNS is not configured properly.</p>
                <p>Please check your DNS settings:</p>
                <div className="mt-2 p-3 bg-gray-100 border-l-2 border-yellow-400 rounded">
                  <p>Create a CNAME record with the following details:</p>
                  <p className="mt-1">
                    <span>Name: </span><strong>{domain.split('.')[0]}</strong>
                  </p>
                  <p>
                    <span>Target: </span><strong>cname.vercel-dns.com.</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : isDomainChecked && !isMisconfigured ? (
        <div className="mb-5 bg-gray-50 border border-gray-200 rounded p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className="ml-3 w-full">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-800">Domain Successfully Configured</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-700">
                <p>Your domain is properly configured and ready to use.</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-5 flex items-center text-gray-500">
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Checking domain configuration...</span>
        </div>
      )}

      <div className="flex items-center space-x-3 my-4">
        <button
          onClick={handleRefresh}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded"
          disabled={isLoading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Checking...' : 'Check Status'}
        </button>

        <div className="flex-grow"></div>

        <button className="px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded">
          Delete Domain
        </button>
      </div>

      <div className="flex items-center justify-end mt-6 pt-4 border-t border-gray-200">
        <button onClick={setShowUpdate} className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-gray-800 rounded">
          Update Settings
        </button>
      </div>
        </>
      }

    </div>
  );
};

export default DomainConfiguration;
