import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const getInitials = (name) => {
        const namesArray = name.split(' ');
        const initials = namesArray.map((n) => n[0]).join('').substring(0, 2).toUpperCase();
        return initials;
};

const Avatar = ({ fullName, size, imageUrl }) => {
    const sizeClasses = {
        small: 'h-6 w-6 text-xs',
        medium: 'h-8 w-8 text-sm',
        large: 'h-10 w-10 text-base',
        xlarge: 'h-12 w-12 text-lg',
        xxlarge: 'h-14 w-14 text-xl',
    };

    return (
        <span className={classNames('inline-flex items-center justify-center rounded-full bg-gray-500', sizeClasses[size])}>
            {imageUrl ? (
                <img src={imageUrl} alt={fullName} className="rounded-full object-cover w-full h-full" />
            ) : (
                <span className="font-medium leading-none text-white">{getInitials(fullName)}</span>
            )}
        </span>
    );
};

Avatar.propTypes = {
    fullName: PropTypes.string.isRequired,
    size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge', 'xxlarge']),
    imageUrl: PropTypes.string,
};

Avatar.defaultProps = {
    size: 'medium',
    imageUrl: null,
};

export default Avatar;
