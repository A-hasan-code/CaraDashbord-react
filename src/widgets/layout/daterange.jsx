import React, { useState } from "react";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  add,
  startOfYear,
  endOfYear,
  isWithinInterval,
} from "date-fns";

export function DateRangePicker({ onDateRangeChange }) {
  const [selectedRange, setSelectedRange] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const ranges = {
    "This Week": [startOfWeek(new Date()), endOfWeek(new Date())],
    "Next Week": [
      startOfWeek(add(new Date(), { weeks: 1 })),
      endOfWeek(add(new Date(), { weeks: 1 })),
    ],
    "This Month": [startOfMonth(new Date()), endOfMonth(new Date())],
    "Next 3 Months": [new Date(), add(new Date(), { months: 3 })],
    "This Year": [startOfYear(new Date()), endOfYear(new Date())],
    "Next Year": [
      startOfYear(add(new Date(), { years: 1 })),
      endOfYear(add(new Date(), { years: 1 })),
    ],
  };

  const handleRangeChange = (range) => {
    setSelectedRange(range);
    const [newStartDate, newEndDate] = ranges[range];
    setStartDate(newStartDate);
    setEndDate(newEndDate);
    setCurrentMonth(newStartDate);
    setCurrentYear(newStartDate.getFullYear());

    onDateRangeChange({ startDate: newStartDate, endDate: newEndDate });
  };

  const handleDateSelect = (date) => {
    let newStartDate = startDate;
    let newEndDate = endDate;

    if (!startDate || (endDate && date < startDate)) {
      newStartDate = date;
      newEndDate = null;
    } else {
      newEndDate = date;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);

    const formattedRange = {
      startDate: newStartDate ? format(newStartDate, "yyyy-MM-dd") : null,
      endDate: newEndDate ? format(newEndDate, "yyyy-MM-dd") : null,
    };

    onDateRangeChange(formattedRange);
  };

  const handleReset = () => {
    setSelectedRange(null);
    setStartDate(null);
    setEndDate(null);
    setCurrentMonth(new Date());
    setCurrentYear(new Date().getFullYear());

    onDateRangeChange({ startDate: null, endDate: null });
  };

  const changeMonth = (direction) => {
    const newMonth = add(currentMonth, { months: direction });
    setCurrentMonth(newMonth);
    setCurrentYear(newMonth.getFullYear());
  };

  const changeYear = (direction) => {
    const newYear = add(currentMonth, { years: direction });
    setCurrentYear(newYear.getFullYear());
    setCurrentMonth(newYear);
  };

  const generateCalendarDays = () => {
    const startOfCalendar = startOfMonth(currentMonth);
    const endOfCalendar = endOfMonth(currentMonth);

    const days = [];
    let currentDate = startOfCalendar;

    while (currentDate.getDay() !== 0) {
      currentDate = add(currentDate, { days: -1 });
    }

    while (currentDate <= endOfCalendar || currentDate.getDay() !== 0) {
      days.push(currentDate);
      currentDate = add(currentDate, { days: 1 });
    }

    return days;
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-transparent mx-auto max-w-md">
      <h2 className="text-lg font-semibold text-black text-center mb-4">
        📆 Date Range Filter
      </h2>

      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {Object.keys(ranges).map((range) => (
          <label key={range} className="flex items-center gap-1 cursor-pointer text-sm">
            <input
              type="radio"
              name="date-range"
              checked={selectedRange === range}
              onChange={() => handleRangeChange(range)}
            />
            {range}
          </label>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-4">
        <div className="flex gap-4 justify-center items-center">
          <div
            className="px-4 py-2 border-2 rounded  md:rounded-full  text-center"
            style={{ background: "white", borderColor: "#5742e3" }}
          >
           
            <div className="text-sm">{startDate ? format(startDate, "MMMM d, yyyy") : "Start Date"}</div>
          </div>

          <span className="text-2xl">&#8594;</span>

          <div
            className="px-4 py-2 border-2 rounded  md:rounded-full text-center"
            style={{ background: "white", borderColor: "#5742e3" }}
          >
            
            <div className="text-sm">{endDate ? format(endDate, "MMMM d, yyyy") : "End Date"}</div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-transparent">
        <div className="flex justify-between mb-4">
          <button onClick={() => changeYear(-1)} className="text-xl font-semibold">
            {"<<"}
          </button>
          <button onClick={() => changeMonth(-1)} className="text-xl font-semibold">
            {"<"}
          </button>
          <h3 className="text-center font-semibold">{format(currentMonth, "MMMM yyyy")}</h3>
          <button onClick={() => changeMonth(1)} className="text-xl font-semibold">
            {">"}
          </button>
          <button onClick={() => changeYear(1)} className="text-xl font-semibold">
            {">>"}
          </button>
        </div>

        <div className="grid grid-cols-7 text-center mt-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="font-semibold text-gray-600">
              {day}
            </div>
          ))}

          {generateCalendarDays().map((date, index) => {
            const isSelected =
              startDate && endDate && isWithinInterval(date, { start: startDate, end: endDate });
            const isStart =
              startDate && format(date, "yyyy-MM-dd") === format(startDate, "yyyy-MM-dd");
            const isEnd =
              endDate && format(date, "yyyy-MM-dd") === format(endDate, "yyyy-MM-dd");

            const highlightStyle =
              isSelected || isStart || isEnd
                ? "bg-[#accdfa] text-black font-semibold"
                : "hover:bg-gray-200";
 const roundedCorners = isStart
    ? "rounded-l-full"
    : isEnd
    ? "rounded-r-full"
    : "";
            return (
              <div
                key={index}
                className={`p-2 text-center cursor-pointer ${highlightStyle} ${roundedCorners}`}
                onClick={() => handleDateSelect(date)}
              >
                {format(date, "d")}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-center ">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-[#5742e3] text-white rounded-full hover:opacity-90"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default DateRangePicker;
