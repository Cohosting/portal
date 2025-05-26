import React from 'react';
import PropTypes from 'prop-types';
import { SidebarTrigger } from '../ui/sidebar';

const PageHeader = ({
  title,
  description,
  action,
  showSidebar = true,
  titleFontSize = 'text-lg sm:text-2xl',
  descriptionFontSize = 'text-sm'
}) => {
  return (
    <div className="border-b border-gray-200 px-3 sm:px-6 py-3">
      <div className="flex flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {showSidebar && (
            <button
              className="lg:hidden sm:mt-[4px]"
              aria-label="Open Sidebar"
            >
              <SidebarTrigger />
            </button>
          )}

          {/* Title and description */}
          <div>
            <h1 className={`${titleFontSize} font-bold text-gray-900`}>
              {title}
            </h1>
            {description && (
              <p className={`mt-1 max-lg:hidden text-gray-500 ${descriptionFontSize}`}>
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Action buttons (e.g., Create Invoice) */}
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  action: PropTypes.node,
  showSidebar: PropTypes.bool,
  titleFontSize: PropTypes.string,
  descriptionFontSize: PropTypes.string,
};

PageHeader.defaultProps = {
  description: '',
  action: null,
  showSidebar: true,
  titleFontSize: 'text-lg sm:text-2xl',
  descriptionFontSize: 'text-sm',
};

export default PageHeader;
