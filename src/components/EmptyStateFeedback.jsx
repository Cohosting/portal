import React from 'react';
import PropTypes from 'prop-types';
import { PlusIcon } from '@heroicons/react/24/solid'; // Ensure you have the correct import for your PlusIcon

const EmptyStateFeedback = ({
  IconComponent,
  title,
  message,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className="text-center rounded-lg p-[30px]  w-[400px] m-auto border-2 border-dashed border-gray-300">
      {IconComponent && (
        <IconComponent
          aria-hidden="true"
          className="mx-auto h-12 w-12 text-gray-400"
        />
      )}
      <h3 className="mt-2 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{message}</p>
      <div className="mt-6">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={onButtonClick}
        >
          <PlusIcon aria-hidden="true" className="-ml-0.5 mr-1.5 h-5 w-5" />
          {buttonText}
        </button>
      </div>
    </div>
  );
};

EmptyStateFeedback.propTypes = {
  IconComponent: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  buttonText: PropTypes.string.isRequired,
  onButtonClick: PropTypes.func,
};

EmptyStateFeedback.defaultProps = {
  IconComponent: null,
  onButtonClick: () => { },
};

export default EmptyStateFeedback;
