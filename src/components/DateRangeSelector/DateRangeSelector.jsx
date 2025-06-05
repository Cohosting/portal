import React from "react";
import { useMediaQuery } from "react-responsive";
import { RangePicker } from "react-ease-picker";

 
const DateRangeSelector = ({ onDateRangeChange, startDate, endDate, colorSettings }) => {
  const isLessThan768 = useMediaQuery({ query: "(max-width: 768px)" });

  let {
    accentColor,
    sidebarBgColor,
    sidebarTextColor,
    sidebarActiveTextColor
  } = colorSettings || {};

  return (
    // 1) Give this div a class so you can scope your CSS-vars here
    <div
      className="flex items-center justify-end pr-4"
      style={{
        "--ease-primary-color": 'red',
      
        "--ease-color-bg-inrange": `${accentColor}33`,
        "--ease-color-btn-primary-bg": 'red',
        "--ease-color-fg-primary": sidebarBgColor,
        "--ease-color-fg-selected": sidebarActiveTextColor,
 
 
      }}
    >
      <div className="relative mt-3 flex items-center cursor-pointer border border-slate-400 rounded-lg text-sm  ">
        <svg
          className="absolute left-2 -z-10 w-5 h-5 mr-2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>

        <RangePicker
          className="pl-9 w-[250px] py-2 cursor-pointer border-0 bg-transparent rounded-lg text-sm     focus:outline-none"
          calendars={isLessThan768 ? 1 : 2}
          placeholder="Filter by date"
          onSelect={(start, end) => {
            onDateRangeChange(start, end);
          }}
          startDate={startDate}
          endDate={endDate}

          position="right"
        />
      </div>
    </div>
  );
};

export default DateRangeSelector;
