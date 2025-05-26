import React from 'react';
import { cn } from '@/lib/utils';

const SwitchComponent = ({ enabled, setEnabled, label, className }) => {
  return (
    <div className={cn("flex items-center space-x-2  ", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        onClick={() => setEnabled(!enabled)}
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2",
          enabled ? "bg-black" : "bg-gray-200"
        )}
      >
        <span className="sr-only">{label || "Toggle"}</span>
        <span
          aria-hidden="true"
          className={cn(
            "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            enabled ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
      {label && (
        <label className="text-sm font-medium">
          {label}
        </label>
      )}
    </div>
  );
};

export default SwitchComponent;