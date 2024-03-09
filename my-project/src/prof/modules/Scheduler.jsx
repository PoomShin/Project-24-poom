import React, { useMemo, useState, useEffect } from 'react';
import { useGroupsByBranchYear } from "../../api/Profs_API";
import DayRows from "./SchedulerContent";

const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 8; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 60) {
            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinute = minute.toString().padStart(2, '0');
            timeSlots.push(`${formattedHour}:${formattedMinute}`);
        }
    }
    return timeSlots;
};

const TimeRows = React.memo(() => {
    const timeSlots = useMemo(() => generateTimeSlots(), []);

    return (
        <div className='grid grid-cols-34'>
            <div className='col-span-2 border text-white dark:border-gray-700 py-1 pl-1'>
                Day/Time
            </div>
            {timeSlots.map((timeSlot, index) => (
                <div key={index} className='col-span-2 border text-white dark:border-gray-700 py-1 pl-1'>
                    {timeSlot}
                </div>
            ))}
        </div>
    )
});

export default function Scheduler({ currentPage, branchYear, currentProfName }) {
    const { data: branchYearGroups, isLoading, isError, refetch } = useGroupsByBranchYear(branchYear);
    const [seeCourseName, setSeeCourseName] = useState(false);

    useEffect(() => {
        refetch();
    }, [branchYear, refetch]);

    const toggleSeeCourseName = () => {
        setSeeCourseName(prevState => !prevState);
    };

    return (
        <>
            <div className='flex justify-start my-2 ml-1'>
                <button className='px-1 bg-violet-600 rounded-md text-white font-bold hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-600'
                    onClick={toggleSeeCourseName}
                >
                    Course Name
                </button>
            </div>
            <div className='border rounded-lg bg-gray-800 mx-1'>
                <TimeRows />
                <DayRows
                    groups={branchYearGroups}
                    page={currentPage}
                    profName={currentProfName}
                    seeCourseName={seeCourseName}
                />
            </div>
        </>
    );
};