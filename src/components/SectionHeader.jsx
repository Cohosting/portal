import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx'; // optional, only if you're using class merging utility
import { Button } from './ui/button';

const SectionHeader = ({
  heading,
  description,
  buttonText,
  onClick,
  hideButton = false,
  className = '',
  styles = {},
}) => {
   return (
    <div className={clsx('flex flex-col sm:flex-row sm:items-center sm:justify-between', className)}>
      <div>
        <h2 className="text-xl font-semibold text-gray-800">{heading}</h2>
        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
      </div>

      {!hideButton && (
        <div className="mt-4 sm:mt-0">
          <Button
            onClick={onClick}
            type="button"
            className="inline-flex font-normal items-center rounded-md bg-black px-4 py-2 text-sm  text-white shadow-sm hover:bg-black-400 focus:outline-none focus:ring-2 focus:ring-black-400 focus:ring-offset-2"
            style={styles}
          >
            {buttonText}
          </Button>
        </div>
      )}
    </div>
  );
};

SectionHeader.propTypes = {
  heading: PropTypes.string.isRequired,
  description: PropTypes.string,
  buttonText: PropTypes.string,
  onClick: PropTypes.func,
  hideButton: PropTypes.bool,
  className: PropTypes.string,
};

SectionHeader.defaultProps = {
  description: '',
  buttonText: '',
  onClick: () => {},
  hideButton: false,
  className: '',
};

export default SectionHeader;
