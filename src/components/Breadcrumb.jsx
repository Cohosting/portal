import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

const Breadcrumb = ({ pages }) => {
  if (!pages || pages.length === 0) return null; // Return null if no pages

  return (
    <nav aria-label="Breadcrumb" className="flex truncate max-w-xs">
      <ol className="flex items-center space-x-2">
        <li>
          <div>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <HomeIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0" />
              <span className="sr-only">Home</span>
            </a>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name} className={page?.settings?.breakPointStyle}>
            <div className="flex items-center">
              <ChevronRightIcon aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-gray-400" />
              <a
                href={page.href}
                aria-current={page.current ? 'page' : undefined}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                title={page.name}
              >
                {page.name}
              </a>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );

};

Breadcrumb.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      current: PropTypes.bool.isRequired,
    })
  ).isRequired,
};

export default Breadcrumb;

