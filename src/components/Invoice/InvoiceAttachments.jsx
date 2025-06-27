import React, { useState } from 'react';
import { Eye, FileText, ChevronDown, Paperclip } from 'lucide-react';
import { Button } from '../ui/button';
const handlePreview = (url) => {
    window.open(url, '_blank');
};

const InvoiceAttachments = ({ attachments, colorSettings }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { primaryButtonColor, primaryButtonTextColor } = colorSettings || {};


    if (!attachments || attachments.length === 0) return null;

    return (
        <div className="mt-4 px-4 sm:px-6">
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 transition-colors duration-200"
                >
                    <div className="flex items-center gap-3">
                        <div className="  p-2 rounded-full" style={{ backgroundColor: primaryButtonColor }}>
                            <Paperclip className="w-5 h-5  " style={{ color: primaryButtonTextColor }} />
                        </div>
                        <div>
                            <h4 className="font-medium text-gray-900 text-left">Invoice Attachments</h4>
                            <p className="text-sm text-gray-600 mt-0.5 text-left">
                                {attachments.length} file{attachments.length !== 1 ? 's' : ''} attached
                            </p>
                        </div>
                    </div>
                    <ChevronDown
                        className={`${isOpen ? 'transform rotate-180' : ''} w-5 h-5 text-gray-500 transition-transform duration-200`}
                    />
                </button>
                
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 pt-4 pb-2' : 'max-h-0'}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center p-3 bg-white shadow-sm rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200">
                                <div className=" p-2 rounded-full" style={{ backgroundColor: primaryButtonColor }}>
                                    <FileText className="h-5 w-5 " style={{ color: primaryButtonTextColor }} />
                                </div>
                                <div className="flex-1 min-w-0 ml-3">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {attachment.name}
                                    </p>
                                </div>
                                <Button
                                style={{
                                    backgroundColor: primaryButtonColor,
                                    color: primaryButtonTextColor
                                }}
                                    onClick={() => handlePreview(attachment.url)}
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium    rounded-md   transition-colors duration-200"
                                >
                                    <Eye className="h-4 w-4 mr-1.5" style={{ color: primaryButtonTextColor }} />
                                    View
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceAttachments;
