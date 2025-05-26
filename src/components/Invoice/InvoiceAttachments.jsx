import React from 'react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Eye, FileText, ChevronDown } from 'lucide-react';

const InvoiceAttachments = ({ attachments }) => {
    const handlePreview = (url) => {
        window.open(url, '_blank');
    };

    if (!attachments || attachments.length === 0) return null;

    return (
        <div className="mt-4">
            <Disclosure>
                {({ open }) => (
                    <>
                        <DisclosureButton className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-left text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75">
                            <span>See Attachments</span>
                          <ChevronDown
                              className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-gray-500 transition-transform duration-200`}
                          />
                      </DisclosureButton>
                      <DisclosurePanel
                          className={`pt-4 pb-2 transition-all duration-300 ease-in-out ${open ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}
                      >
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {attachments.map((attachment) => (
                                  <div key={attachment.id} className="flex items-center p-2 bg-white shadow rounded-lg">
                                      <div className="bg-blue-100 p-2 rounded-full">
                            <FileText className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="flex-1 min-w-0 ml-4">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {attachment.name}
                            </p>
                        </div>
                        <button
                            onClick={() => handlePreview(attachment.url)}
                            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                        </button>
                    </div>
                ))}
                          </div>
                      </DisclosurePanel>
                  </>
              )}
          </Disclosure>
      </div>
  );
};

export default InvoiceAttachments;
