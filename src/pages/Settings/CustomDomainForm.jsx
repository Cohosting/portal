import React, { useState, Fragment } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { usePortalData } from '../../hooks/react-query/usePortalData';
import { useSelector } from 'react-redux';
import { supabase } from '../../lib/supabase';
import SectionHeader from '../../components/SectionHeader';

export const CustomDomainForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [domain, setDomain] = useState('');
  const [provider, setProvider] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const { user, currentSelectedPortal } = useSelector(state => state.auth);
  const { data: portal } = usePortalData(currentSelectedPortal);
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
    return /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/.test(domain);
  };

  const isValidSubdomain = subdomain => {
    if (subdomain.length > 63 || subdomain.length < 1) {
      return false;
    }
    return /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/i.test(subdomain);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    let errorObj = {};

    if (!isValidDomain(domain)) {
      errorObj = {
        ...errorObj,
        domain: 'Domain is not valid. Please enter a valid domain.',
      };
    }

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

    let dom = domain.toLowerCase().trim();
    if (dom.startsWith('http://')) {
      dom = dom.substring(7);
    } else if (dom.startsWith('https://')) {
      dom = dom.substring(8);
    }
    if (dom.includes('www.')) {
      dom = dom.replace('www.', '');
    }

    let subdom = subdomain.toLowerCase().trim();

    try {
      const { error: portalError } = await supabase.from('portals').update({
        settings: { 
          ...portal.settings,
          domain: dom,
          provider,
          subdomain: subdom,
          customDomain: `${subdom}.${dom}`,
        },
      }).eq('id', portal.id);

      if (portalError) throw portalError;

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

    setIsOpen(false);
    setIsConfirmationOpen(true);
  };

  return (
    <>
      <div className="flex flex-col my-5">
        <SectionHeader hideButton heading="Custom Domain" description="Customize the domain used when clients visit your portal." />

        <button
          className="text-sm w-56 bg-black text-white mt-3 px-4 py-2 rounded"
          onClick={() => setIsOpen(true)}
        >
          Connect Custom Domain
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[10000]" onClose={() => setIsOpen(false)}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <DialogTitle
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Connect a Custom Domain
                  </DialogTitle>
                  <div className="mt-2">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-4">
                        <label htmlFor="domain" className="block text-sm font-medium text-gray-700">
                          Domain name
                        </label>
                        <input
                          type="text"
                          id="domain"
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${error.domain ? 'border-red-500' : ''
                            }`}
                          placeholder="Your domain"
                          value={domain}
                          onChange={(e) => {
                            setDomain(e.target.value);
                            if (error.domain) setError((prev) => ({ ...prev, domain: '' }));
                          }}
                        />
                        {error.domain && (
                          <p className="mt-2 text-sm text-red-600">{error.domain}</p>
                        )}
                      </div>

                      <div className="mb-4">
                        <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
                          Domain Provider
                        </label>
                        <select
                          id="provider"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                          value={provider}
                          onChange={(e) => setProvider(e.target.value)}
                        >
                          <option value="">Select option</option>
                          {providers.map((provider) => (
                            <option key={provider} value={provider}>
                              {provider}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="subdomain" className="block text-sm font-medium text-gray-700">
                          Subdomain
                        </label>
                        <input
                          type="text"
                          id="subdomain"
                          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${error.subdomain ? 'border-red-500' : ''
                            }`}
                          placeholder="Subdomain"
                          value={subdomain}
                          onChange={(e) => {
                            setSubdomain(e.target.value);
                            if (error.subdomain)
                              setError((prev) => ({ ...prev, subdomain: '' }));
                          }}
                        />
                        {error.subdomain && (
                          <p className="mt-2 text-sm text-red-600">{error.subdomain}</p>
                        )}
                      </div>

                      <div className="mt-4">
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Submitting...' : 'Submit'}
                        </button>
                      </div>
                    </form>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isConfirmationOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsConfirmationOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Connect Your Domain
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Thank you! Now, please follow these steps to set up your custom domain:
                    </p>
                    <ol className="list-decimal list-inside mt-2 text-sm text-gray-500">
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
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => setIsConfirmationOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};