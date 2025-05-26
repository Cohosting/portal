import React from 'react';
import { File, FileText, Download } from 'lucide-react';

const FileItem = ({ fileName, fileType, fileSize }) => {
  const isPdf = fileType === 'pdf';

  const getFileIcon = () => {
    if (isPdf) {
      return <FileText size={24} strokeWidth={2.5} className="text-red-500 sm:w-8 sm:h-8" />;
    } else {
      return <File size={24} strokeWidth={2.5} className="text-blue-500 sm:w-8 sm:h-8" />;
    }
  };

  return (
    <div className="flex items-center p-2 sm:p-3 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex-shrink-0 mr-2 sm:mr-3">
        {getFileIcon()}
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{fileName}</p>
        <p className="text-xs text-gray-500 capitalize mt-0.5 sm:mt-1 truncate">{fileType}: {fileSize}</p>
      </div>
      <button className="ml-2 text-gray-400 hover:text-gray-500">
        <Download size={16} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default FileItem;
