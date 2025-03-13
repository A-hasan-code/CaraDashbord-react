import React, { useState } from 'react';
import { DateRangePicker, createStaticRanges } from 'react-date-range';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subYears, subMonths, startOfQuarter, endOfQuarter, startOfDay, endOfDay } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const RangeCalender = () => {
    const [state, setState] = useState([
        { startDate: new Date(), endDate: addDays(new Date(), 7), key: 'selection' }
    ]);


    // Custom Static Ranges
    const staticRanges = createStaticRanges([
        {
            label: 'Today',
            range: () => ({
                startDate: startOfDay(new Date()),
                endDate: endOfDay(new Date())
            })
        },
        {
            label: 'This Week',
            range: () => ({
                startDate: startOfWeek(new Date()),
                endDate: endOfWeek(new Date())
            })
        },
        {
            label: 'Last Month',
            range: () => ({
                startDate: startOfMonth(subMonths(new Date(), 1)),
                endDate: endOfMonth(subMonths(new Date(), 1))
            })
        },
        {
            label: 'This Quarter',
            range: () => ({
                startDate: startOfQuarter(new Date()),
                endDate: endOfQuarter(new Date())
            })
        },
        {
            label: 'Last Year',
            range: () => ({
                startDate: startOfYear(subYears(new Date(), 1)),
                endDate: endOfYear(subYears(new Date(), 1))
            })
        },
        {
            label: 'This Year',
            range: () => ({
                startDate: startOfYear(new Date()),
                endDate: endOfYear(new Date())
            })
        }
    ]);

    return (
        <>
            <DateRangePicker
                onChange={item => setState([item.selection])}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                // months={1}
                ranges={state}
                direction="horizontal"
                staticRanges={staticRanges}
            />
        </>
    )
}

export default RangeCalender
