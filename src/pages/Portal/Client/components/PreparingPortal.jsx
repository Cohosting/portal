import React, { useState, useEffect } from 'react';

export const PreparingPortal = ({ 
  onComplete,
  appTitle = "Portal" 
}) => {
  // Default color scheme
  const primaryColor = "rgb(79, 70, 229)"; // Indigo
  const bgColor = "#f9fafb"; // Light gray
  const textColor = "#111827"; // Dark gray
  const accentColor = "rgba(79, 70, 229, 0.2)"; // Transparent primary

  // Loading phases
  const phases = [
    "Initializing...",
    "Connecting to server...",
    "Loading configuration...",
    "Preparing workspace...",
    "Almost ready..."
  ];

  const [currentPhase, setCurrentPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Manage loading progress
  useEffect(() => {
    // Calculate target progress based on current phase
    const targetProgress = ((currentPhase + 1) / phases.length) * 100;
    
    // Progress animation interval
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        // Slowly approach target
        const nextProgress = prevProgress + Math.min(1, (targetProgress - prevProgress) * 0.05);
        
        // If we're close enough to target, move to next phase
        if (Math.abs(nextProgress - targetProgress) < 0.5 && currentPhase < phases.length - 1) {
          setCurrentPhase(prevPhase => prevPhase + 1);
        }
        
        // If we're at the final phase and progress is complete
        if (currentPhase === phases.length - 1 && nextProgress >= 99) {
          clearInterval(interval);
          
          // Slight delay before completing
          setTimeout(() => {
            if (onComplete) onComplete();
          }, 500);
          
          return 100;
        }
        
        return nextProgress;
      });
    }, 50);
    
    return () => clearInterval(interval);
  }, [currentPhase, phases.length, onComplete]);

  return (
    <div 
      className="flex h-screen w-full flex-col items-center justify-center"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="w-full max-w-md px-6 text-center">
        {/* Logo placeholder */}
        <div className="mb-8 mx-auto">
          <div className="relative w-20 h-20 mx-auto">
            {/* Animated cube */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-12 h-12 rounded-xl"
                style={{ 
                  backgroundColor: accentColor,
                  boxShadow: `0 0 20px ${accentColor}`,
                  transform: 'rotate(45deg)',
                  animation: 'pulse 2s infinite',
                }}
              ></div>
            </div>
            
            {/* Inner element */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-6 h-6 rounded-lg"
                style={{ 
                  backgroundColor: primaryColor,
                  transform: 'rotate(45deg)',
                  animation: 'pulse-inverse 2s infinite',
                }}
              ></div>
            </div>
            
            {/* Orbiting dots */}
            {[...Array(4)].map((_, idx) => (
              <div 
                key={idx}
                className="absolute w-2 h-2 rounded-full"
                style={{ 
                  backgroundColor: primaryColor,
                  opacity: 0.7,
                  top: '50%',
                  left: '50%',
                  marginTop: '-4px',
                  marginLeft: '-4px',
                  transformOrigin: '50% 50%',
                  animation: `orbit 3s infinite linear, blink 2s infinite alternate`,
                  animationDelay: `${idx * 0.5}s, ${idx * 0.2}s`,
                }}
              ></div>
            ))}
          </div>
        </div>
        
        {/* App title */}
        <h1 className="text-2xl font-bold mb-6">
          {appTitle}
        </h1>
        
        {/* Loading message */}
        <p className="text-sm text-gray-500 mb-6 h-6">
          {phases[currentPhase]}
        </p>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1 mb-3 overflow-hidden">
          <div 
            className="h-1 rounded-full transition-all duration-300 ease-out"
            style={{ 
              backgroundColor: primaryColor,
              width: `${progress}%` 
            }}
          ></div>
        </div>
        
        {/* Progress indicator */}
        <div className="flex justify-center space-x-3 mb-4">
          {[...Array(5)].map((_, idx) => {
            const isActive = idx <= Math.floor(progress / 20);
            return (
              <div 
                key={idx}
                className={`w-1.5 h-1.5 rounded-full ${isActive ? '' : 'bg-gray-300'}`}
                style={{ 
                  backgroundColor: isActive ? primaryColor : undefined,
                  transition: 'background-color 0.3s ease'
                }}
              ></div>
            );
          })}
        </div>
        
        {/* Loading dots */}
        <div className="flex justify-center space-x-1.5">
          {[...Array(3)].map((_, idx) => (
            <div 
              key={idx}
              className="w-2 h-2 rounded-full"
              style={{ 
                backgroundColor: primaryColor,
                animation: 'bounce 1.5s infinite ease-in-out both',
                animationDelay: `${idx * 0.15}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(0.95) rotate(45deg); opacity: 0.5; }
          50% { transform: scale(1.05) rotate(45deg); opacity: 0.8; }
        }
        
        @keyframes pulse-inverse {
          0%, 100% { transform: scale(1.05) rotate(45deg); }
          50% { transform: scale(0.95) rotate(45deg); }
        }
        
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(18px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(18px) rotate(-360deg); }
        }
        
        @keyframes blink {
          0% { opacity: 0.3; }
          100% { opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};