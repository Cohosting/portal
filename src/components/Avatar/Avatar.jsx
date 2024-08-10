import React from "react";
import { avatarVariants } from "./avatarVariants";
import PlaceholderSVG from "./PlaceholderSVG";

const Avatar = ({
  src,
  alt,
  variant,
  size,
  className,
  imgProps,
  fallback,
  initial,
}) => {
  const variantClass = avatarVariants({ variant, size });

  return (
    <div className={`${variantClass} ${className}`}>
      {src ? (
        <img
          alt={alt || ""}
          src={src}
          className="h-full w-full object-cover"
          {...imgProps}
        />
      ) : initial ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-300 text-gray-600">
          {initial.toUpperCase()}
        </div>
      ) : (
        <div className="inline-block h-full w-full overflow-hidden bg-gray-100">
          {fallback}
        </div>
      )}
    </div>
  );
};

Avatar.defaultProps = {
  variant: "circle",
  size: "md",
  className: "",
  imgProps: {},
  fallback: <PlaceholderSVG />,
};

export default Avatar;
