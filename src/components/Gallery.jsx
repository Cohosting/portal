import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Play } from 'lucide-react';

const Gallery = ({ 
  isOpen, 
  onClose, 
  images = [], 
  initialIndex = 0 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const galleryRef = useRef(null);
  const imageRef = useRef(null);

  // Reset state when gallery opens/closes or images change
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setImageLoaded(false);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          nextImage();
          break;
        case 'ArrowLeft':
          prevImage();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  // Focus management
  useEffect(() => {
    if (isOpen && galleryRef.current) {
      galleryRef.current.focus();
    }
  }, [isOpen]);

  const nextImage = () => {
    if (images.length > 1) {
      setImageLoaded(false);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setImageLoaded(false);
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  const selectImage = (index) => {
    if (index !== currentIndex) {
      setImageLoaded(false);
      setCurrentIndex(index);
    }
  };

  const handleDownload = async () => {
    try {
      const currentMedia = images[currentIndex];
      if (!currentMedia?.url) return;

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = currentMedia.url;
      
      // Set download filename - use original name or generate one
      const fileName = currentMedia.name || 
        `${currentMedia.type === 'video' ? 'video' : 'image'}_${Date.now()}.${currentMedia.type === 'video' ? 'mp4' : 'jpg'}`;
      
      link.download = fileName;
      link.target = '_blank';
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const calculateDimensions = (naturalWidth, naturalHeight) => {
    const containerWidth = window.innerWidth * 0.9; // 90% of viewport width
    const containerHeight = window.innerHeight * 0.7; // 70% of viewport height
    
    // Calculate scaled dimensions while maintaining aspect ratio
    const aspectRatio = naturalWidth / naturalHeight;
    
    // Enforce minimum size (300px on the smaller dimension)
    const minSize = 300;
    let width = naturalWidth;
    let height = naturalHeight;
    
    if (naturalWidth < minSize || naturalHeight < minSize) {
      if (aspectRatio > 1) {
        // Landscape: scale based on height
        height = minSize;
        width = minSize * aspectRatio;
      } else {
        // Portrait: scale based on width
        width = minSize;
        height = minSize / aspectRatio;
      }
    }
    
    // Enforce maximum size to fit within container
    if (width > containerWidth) {
      width = containerWidth;
      height = width / aspectRatio;
    }
    
    if (height > containerHeight) {
      height = containerHeight;
      width = height * aspectRatio;
    }
    
    return { width, height };
  };

  const handleImageLoad = (e) => {
    const img = e.target;
    const { naturalWidth, naturalHeight } = img;
    const dimensions = calculateDimensions(naturalWidth, naturalHeight);
    setImageDimensions(dimensions);
    setImageLoaded(true);
  };

  const handleVideoLoad = (e) => {
    const video = e.target;
    const { videoWidth, videoHeight } = video;
    const dimensions = calculateDimensions(videoWidth, videoHeight);
    setImageDimensions(dimensions);
    setImageLoaded(true);
  };

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4"
      onClick={onClose}
      ref={galleryRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery"
    >
      {/* Top controls */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        {/* Download button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDownload();
          }}
          className="p-2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
          aria-label={`Download ${currentImage?.type || 'media'}`}
          title={`Download ${currentImage?.name || (currentImage?.type === 'video' ? 'video' : 'image')}`}
        >
          <Download size={20} />
        </button>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="p-2 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
          aria-label="Close gallery"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Navigation buttons - only show if more than one image */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-50 p-3 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-50 p-3 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      {/* Main image container */}
      <div className="flex-1 flex items-center justify-center mb-6">
        <div 
          className="relative transition-all duration-300 ease-in-out overflow-hidden rounded-lg"
          style={{
            width: imageLoaded ? `${imageDimensions.width}px` : '300px',
            height: imageLoaded ? `${imageDimensions.height}px` : '200px',
          }}
        >
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-700 animate-pulse" />
          )}
          
          {/* Main media content */}
          {currentImage?.type === 'image' ? (
            <img
              ref={imageRef}
              src={currentImage?.url}
              alt={currentImage?.name || `Image ${currentIndex + 1}`}
              className={`
                w-full h-full object-contain shadow-2xl
                transition-opacity duration-200
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              `}
              onClick={(e) => e.stopPropagation()}
              onLoad={handleImageLoad}
              draggable={false}
            />
          ) : (
            <video
              ref={imageRef}
              src={currentImage?.url}
              className={`
                w-full h-full object-contain shadow-2xl
                transition-opacity duration-200
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              `}
              controls
              onClick={(e) => e.stopPropagation()}
              onLoadedMetadata={handleVideoLoad}
              preload="metadata"
            />
          )}
        </div>
      </div>

      {/* Thumbnail strip - only show if more than one image */}
      {images.length > 1 && (
        <div className="flex items-center gap-2 max-w-full overflow-x-auto pb-4 pt-2">
          <div className="flex gap-2 px-4">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  selectImage(index);
                }}
                className={`
                  relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden
                  transition-all duration-200 hover:scale-[1.02] transform-gpu
                  ${index === currentIndex 
                    ? 'ring-2 ring-white ring-opacity-80 shadow-lg' 
                    : 'ring-1 ring-gray-500 ring-opacity-30 hover:ring-white hover:ring-opacity-50'
                  }
                `}
                aria-label={`View ${image.type} ${index + 1}`}
              >
                {image.type === 'image' ? (
                  <img
                    src={image.url}
                    alt={image.name || `Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <div className="relative w-full h-full bg-gray-800">
                    <video
                      src={image.url}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                    {/* Video play indicator */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                      <Play className="w-4 h-4 text-white" fill="currentColor" />
                    </div>
                  </div>
                )}
                
                {/* Active indicator */}
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-white bg-opacity-10" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm font-medium">
          {currentIndex + 1} / {images.length} • {currentImage?.type === 'video' ? 'Video' : 'Image'}
        </div>
      )}
    </div>
  );
};

export default Gallery;