import React, { useState } from "react";
import { DateRangePicker, createStaticRanges } from "react-date-range";
import { 
  addDays, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  subYears, 
  subMonths, 
  startOfQuarter, 
  endOfQuarter, 
  startOfDay, 
  endOfDay, 
  format 
} from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const RangeCalender = ({ onDateRangeChange }) => {
  const [state, setState] = useState([
    { startDate: new Date(), endDate: addDays(new Date(), 7), key: "selection" },
  ]);

  // Custom Static Ranges
  const staticRanges = createStaticRanges([
    {
      label: "Today",
      range: () => ({
        startDate: startOfDay(new Date()),
        endDate: endOfDay(new Date()),
      }),
    },
    {
      label: "This Week",
      range: () => ({
        startDate: startOfWeek(new Date()),
        endDate: endOfWeek(new Date()),
      }),
    },
    {
      label: "Last Month",
      range: () => ({
        startDate: startOfMonth(subMonths(new Date(), 1)),
        endDate: endOfMonth(subMonths(new Date(), 1)),
      }),
    },
    {
      label: "This Quarter",
      range: () => ({
        startDate: startOfQuarter(new Date()),
        endDate: endOfQuarter(new Date()),
      }),
    },
    {
      label: "Last Year",
      range: () => ({
        startDate: startOfYear(subYears(new Date(), 1)),
        endDate: endOfYear(subYears(new Date(), 1)),
      }),
    },
    {
      label: "This Year",
      range: () => ({
        startDate: startOfYear(new Date()),
        endDate: endOfYear(new Date()),
      }),
    },
  ]);

  // Handle Date Change
  const handleDateChange = (item) => {
    const formattedStartDate = format(item.selection.startDate, "yyyy-MM-dd");
    const formattedEndDate = format(item.selection.endDate, "yyyy-MM-dd");
    setState([item.selection]);
    if (onDateRangeChange) {
      onDateRangeChange({
        startDate: formattedStartDate,
        endDate: formattedEndDate,
      });
    }
  };

  return (
    <div className="flex justify-center p-4">
      <div className="">
        {/* Static Ranges with Horizontal Scroll on Mobile */}
        <div className="overflow-x-auto whitespace-nowrap scrollbar-hide flex gap-2 p-2 border-b sm:hidden">
          {staticRanges.map((range, index) => (
            <button
              key={index}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-gray-300 transition"
              onClick={() => handleDateChange({ selection: range.range() })}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Date Picker */}
        <div className="w-full flex justify-center">
          <div className="w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
            <DateRangePicker
              onChange={handleDateChange}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              ranges={state}
              direction="vertical"
              className="w-full rounded-md shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RangeCalender;
