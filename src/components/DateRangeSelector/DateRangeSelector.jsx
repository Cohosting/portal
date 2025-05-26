
import { useMediaQuery } from "react-responsive";
import { RangePicker } from "react-ease-picker";

const DateRangeSelector = ({
    onDateRangeChange,
    startDate,
    endDate

}) => {
    const isLessThan768 = useMediaQuery({ query: '(max-width: 768px)' });
    return (
        <div className="flex items-center justify-end pr-4">

            <div className=" relative mt-3 flex items-center cursor-pointer      border border-gray-300 rounded-md text-sm text-gray-700">
                <svg className="absolute left-2  -z-10 w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <RangePicker
                    className=" pl-9 w-[250px]  py-2 cursor-pointer border-0    bg-transparent rounded-md   text-sm text-gray-700"
                    calendars={isLessThan768 ? 1 : 2}
                    placeholder="Filter by date"

                    onSelect={(start, end) => {
                        onDateRangeChange(start, end);
                    }}
                    startDate={startDate}
                    endDate={endDate}
                    presets={[
                        {
                            label: "Last Week",
                            startDate: "2022-01-01",
                            endDate: "2023-01-01",
                        },
                        {
                            label: "Last Month",
                            startDate: "2021-01-01",
                            endDate: "2023-01-01",
                        },
                    ]}
                    position="right"
                >

                </RangePicker>
            </div>
        </div>
    );

}

export default DateRangeSelector;