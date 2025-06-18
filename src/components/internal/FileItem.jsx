import React, { useState } from 'react';
import { File, FileText, Download, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '@/lib/supabase';

const FileItem = ({ fileName, fileType, fileSize, filePath }) => {
  const [loading, setLoading] = useState(false);
  const isPdf = fileType === 'pdf';

  const getFileIcon = () => {
    return isPdf
      ? <FileText size={24} strokeWidth={2.5} className="text-red-500 sm:w-8 sm:h-8" />
      : <File size={24} strokeWidth={2.5} className="text-blue-500 sm:w-8 sm:h-8" />;
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      // 1) Download the file data as a Blob
      const { data, error } = await supabase
        .storage
        .from('chat-uploads')
        .download(filePath);

      if (error) {
        toast.error(`Download error: ${error.message}`);
        return;
      }

      // 2) Create a temporary object URL
      const blobUrl = window.URL.createObjectURL(data);

      // 3) Trigger download via hidden <a>
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // 4) Cleanup
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Failed to download file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center p-2 sm:p-3 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex-shrink-0 mr-2 sm:mr-3">
        {getFileIcon()}
      </div>
      <div className="flex-grow min-w-0">
        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{fileName}</p>
        <p className="text-xs text-gray-500 capitalize mt-0.5 sm:mt-1 truncate">
          {fileType}: {fileSize}
        </p>
      </div>
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`ml-2 ${loading ? 'cursor-wait' : 'hover:text-gray-500'} text-gray-400`}
        aria-label={`Download ${fileName}`}
      >
        {loading
          ? <Loader2 size={16} className="sm:w-5 sm:h-5 animate-spin" strokeWidth={2.5} />
          : <Download size={16} className="sm:w-5 sm:h-5" strokeWidth={2.5} />
        }
      </button>
    </div>
  );
};

export default FileItem;
