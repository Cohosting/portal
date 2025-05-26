import React from 'react';
import PropTypes from 'prop-types';
import { PlusIcon } from '@heroicons/react/24/solid';
import { Button } from '@/components/ui/button';

const EmptyStateFeedback = ({
  IconComponent,
  title,
  message,
  buttonText,
  onButtonClick,
  centered = false,
  buttonIcon = true,
  customButtonIcon = null,
}) => {
  // Determine which icon to render for the button
  const renderButtonIcon = () => {
    if (!buttonIcon) return null;
    
    if (customButtonIcon) {
      const CustomIcon = customButtonIcon;
      return <CustomIcon className="h-4 w-4 mr-2" aria-hidden="true" />;
    }
    
    return <PlusIcon className="h-4 w-4 mr-2" aria-hidden="true" />;
  };

  return (
    <div className={`w-full ${centered ? 'flex flex-col items-center text-center' : ''}`}>
      {IconComponent && (
        <IconComponent
          aria-hidden="true"
          className={`h-10 w-10 mb-4 ${centered ? 'mx-auto text-gray-400' : 'text-gray-400'}`}
        />
      )}

      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 max-w-md">{message}</p>
      {buttonText && (
        <div className="mt-4">
          <Button
            className="bg-black text-white hover:bg-gray-800"
            onClick={onButtonClick}
          >
            {renderButtonIcon()}
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
};

EmptyStateFeedback.propTypes = {
  IconComponent: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func,
  centered: PropTypes.bool,
  buttonIcon: PropTypes.bool,
  customButtonIcon: PropTypes.elementType,
};

EmptyStateFeedback.defaultProps = {
  IconComponent: null,
  onButtonClick: () => {},
  centered: false,
  buttonIcon: true,
  customButtonIcon: null,
};

export default EmptyStateFeedback;