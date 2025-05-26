import React from "react";
import { avatarVariants } from "./avatarVariants";

const Avatar = ({
  src,
  alt,
  variant,
  size,
  className,
  imgProps,
  fallback,
  initial,
  name, // New prop for extracting initials
}) => {
  const variantClass = avatarVariants({ variant, size });

  // Function to get initials from name
  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2); // Limit to 2 characters for better display
  };

  // Determine what to display as fallback
  const getInitialsDisplay = () => {
    if (initial) return initial.toUpperCase();
    if (name) return getInitials(name);
    return "";
  };

  const initialsToShow = getInitialsDisplay();

  return (
    <div className={`${variantClass} ${className}`}>
      {src ? (
        <img
          alt={alt || ""}
          src={src}
          className="h-full w-full object-cover"
          {...imgProps}
        />
      ) : initialsToShow ? (
        <div className="flex h-full w-full items-center justify-center bg-gray-300 text-gray-600 font-medium">
          {initialsToShow}
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
          {fallback || "?"}
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
  fallback: "?",
};

export default Avatar;