import { PaperClipIcon } from '@heroicons/react/24/solid';
import React, { useRef } from 'react';

const AttachFileButton = ({ onFileSelect }) => {
    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (onFileSelect) {
            onFileSelect(files);
        }
    };

    return (
        <div className="flex items-center">
            <button
                type="button"
                onClick={handleButtonClick}
                className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
            >
                <PaperClipIcon aria-hidden="true" className="h-5 w-5" />
                <span className="sr-only">Attach a file</span>
            </button>
            <input
                type="file"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    );
};

export default AttachFileButton;
