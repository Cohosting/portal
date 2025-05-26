import React from "react";
import buttonVariants from "./buttonVariants";

const Loader = () => (
    <svg
        className="animate-spin h-5 w-5 text-current"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        ></circle>
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        ></path>
    </svg>
);

export const Button = ({
    startIcon,
    endIcon,
    loading,
    className,
    fullWidth,
    variant,
    size,
    color,
    children,
    style,
    disabled,
    ...props
}) => {
    const variantClass = buttonVariants({ variant, size, fullWidth });

    const renderIcon = (icon) => (
        <span className="flex items-center mr-2">
            {loading ? <Loader /> : icon}
        </span>
    );

    const disabledClass = (disabled || loading)
        ? 'opacity-50 cursor-not-allowed hover:bg-opacity-100'
        : '';

    return (
        <button
            className={`${variantClass} ${className} ${disabledClass}  `}
            style={style}
            disabled={disabled || loading}
            {...props}
        >
            <span className="flex items-center justify-center">
                {startIcon && !loading && renderIcon(startIcon)}
                {loading && renderIcon()}
                <span className="select-none">{children}</span>
                {endIcon && <span className="flex items-center ml-2">{endIcon}</span>}
            </span>
        </button>
    );
};

Button.defaultProps = {
    variant: "primary",
    size: "md",
    fullWidth: false,
    className: "",
    style: {},
    disabled: false,
};

export default Button;