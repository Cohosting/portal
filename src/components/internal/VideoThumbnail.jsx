import { useEffect, useRef, useState } from "react";

const VideoThumbnail = ({ videoUrl, onClick }) => {
  const videoRef = useRef(null);
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    let thumbnailCaptured = false;

    const captureFrame = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      setThumbnail(canvas.toDataURL());
      thumbnailCaptured = true;
    };

    const handleTimeUpdate = () => {
      if (!thumbnailCaptured && video.currentTime >= 1) {
        captureFrame();
        video.removeEventListener('timeupdate', handleTimeUpdate);
      }
    };

    video.addEventListener('loadedmetadata', () => {
      if (video.duration <= 1) {
        video.currentTime = 0;
      } else {
        video.currentTime = 1;
      }
    });

    video.addEventListener('seeked', () => {
      if (!thumbnailCaptured) {
        captureFrame();
      }
    });

    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoUrl]);

  return (
    <div className="relative w-full h-full cursor-pointer" onClick={onClick}>
      <video ref={videoRef} src={videoUrl} className="hidden" preload="metadata" />
      {thumbnail && (
        <img src={thumbnail} alt="Video thumbnail" className="w-full h-full object-cover" />
      )}
      <button className="absolute inset-0 flex items-center justify-center text-white text-2xl bg-black bg-opacity-30">
        ▶
      </button>
    </div>
  );
};

export default VideoThumbnail;