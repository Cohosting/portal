import React from "react";
import { iconButtonVariants } from "./iconButtonVariants";
import PropTypes from "prop-types";

const IconButton = ({
    icon,
    tooltip,
    className,
    variant,
    size,
    style,
    disabled,
    ...props
}) => {
    const variantClass = iconButtonVariants({ variant, size });

    return (
        <div
            className={`${variantClass} ${className}`}
            style={style}
            disabled={disabled}
            aria-label={tooltip}
            {...props}
        >
            <span className="flex items-center">{icon}</span>
        </div>
    );
};

IconButton.propTypes = {
    icon: PropTypes.node.isRequired,
    tooltip: PropTypes.string,
    className: PropTypes.string,
    variant: PropTypes.oneOf(["contained", "outlined", "neutral", "ghost"]),
    size: PropTypes.oneOf(["small", "medium", "large"]),
    style: PropTypes.object,
    disabled: PropTypes.bool,
};

IconButton.defaultProps = {
    variant: "contained",
    size: "medium",
    className: "",
    style: {},
    disabled: false,
    tooltip: "",
};

export default IconButton;
