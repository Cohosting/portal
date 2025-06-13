import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  File, 
  Download, 
  Loader2, 
  AlertCircle, 
  X, 
  ZoomIn, 
  ZoomOut, 
  RotateCw,
  Share
} from 'lucide-react';

// File Viewer Component
const FileViewer = ({ file, fileUrl, downloadFile, loadingStates, isOpen, onClose, formatFileSize }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  
  console.log({fileUrl})

  useEffect(() => {
    if (isOpen && file) {
      setLoading(true);
      setError(null);
      setZoom(100);
      setRotation(0);
      
      // Simulate loading time
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, file]);

  if (!isOpen || !file) return null;

  const getFileType = (mimeType, fileName) => {
    if (mimeType?.startsWith('image/')) return 'image';
    if (mimeType === 'application/pdf') return 'pdf';
    if (mimeType?.includes('text/') || fileName?.endsWith('.txt')) return 'text';
    if (mimeType?.includes('video/')) return 'video';
    if (mimeType?.includes('audio/')) return 'audio';
    return 'unsupported';
  };

  const fileType = getFileType(file.mime_type, file.name);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const renderFileContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading preview...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <p className="text-gray-600 mb-2">Unable to preview this file</p>
            <p className="text-sm text-gray-500">{error}</p>
          </div>
        </div>
      );
    }

    switch (fileType) {
      case 'image':
        return (
          <div className="flex items-center justify-center min-h-96 bg-gray-100 rounded-lg">
            <img
              src={fileUrl}
              alt={file.name}
              className="max-w-full max-h-96 object-contain"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transition: 'transform 0.2s ease'
              }}
              onError={() => setError('Failed to load image')}
            />
          </div>
        );

      case 'pdf':
        return (
          <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
            <div className="text-center">
              <File className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <p className="text-gray-700 font-medium mb-2">PDF Document</p>
              <p className="text-sm text-gray-500 mb-4">{file.name}</p>
              <Button
                onClick={() => window.open(fileUrl, '_blank')}
                className="bg-red-600 hover:bg-red-700"
              >
                Open in New Tab
              </Button>
            </div>
          </div>
        );

      case 'text':
        return (
          <div className="bg-white p-6 rounded-lg border max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
              {`This is a sample text file preview.
              
Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco 
laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit 
esse cillum dolore eu fugiat nulla pariatur. Excepteur sint 
occaecat cupidatat non proident, sunt in culpa qui officia 
deserunt mollit anim id est laborum.`}
            </pre>
          </div>
        );

      case 'video':
        return (
          <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
            <video
              controls
              className="max-w-full max-h-full"
              style={{ maxHeight: '384px' }}
            >
              <source src={fileUrl} type={file.mime_type} />
              Your browser does not support the video tag.
            </video>
          </div>
        );

      case 'audio':
        return (
          <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <File className="w-12 h-12 text-blue-600" />
              </div>
              <p className="text-gray-700 font-medium mb-4">{file.name}</p>
              <audio controls className="w-full max-w-md">
                <source src={fileUrl} type={file.mime_type} />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <File className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-700 font-medium mb-2">Preview not available</p>
              <p className="text-sm text-gray-500 mb-4">
                This file type is not supported for preview
              </p>
              <Button
                onClick={() => window.open(fileUrl, '_blank')}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                Download File
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-white p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold">{file.name}</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                {file.mime_type} • {formatFileSize ? formatFileSize(file.file_size) : file.file_size}
              </p>
            </div>
            
            {fileType === 'image' && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.max(25, zoom - 25))}
                  disabled={zoom <= 25}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-gray-600 min-w-12 text-center">
                  {zoom}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                  disabled={zoom >= 200}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setRotation((rotation + 90) % 360)}
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              </div>
            )}
            
     
          </div>
        </DialogHeader>
        
        <div className="p-6 overflow-auto">
          {renderFileContent()}
        </div>
        
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
    <div className="text-sm text-gray-600">
      Created: {formatDate(file.created_at)}
    </div>
    <div className="flex space-x-2">
  
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => downloadFile(file)}
        disabled={loadingStates?.downloading === file.id}
      >
        {loadingStates?.downloading === file.id ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Downloading...
          </>
        ) : (
          <>
            <Download className="w-4 h-4 mr-2" />
            Download
          </>
        )}
      </Button>
    </div>
  </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileViewer;