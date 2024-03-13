import React, { useMemo, useState } from 'react';
import ViewCourseButton from '../components/viewCourseButton';
import GroupsNotification from '../components/GroupsNotification';
import DayRows from "./DayRows";

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
    );
});

export default function Scheduler({ curPage, curProf, curBranchYear, userData }) {
    const { name: profName, role, branch_tag: profBranchTag } = userData;
    const [seeCourseName, setSeeCourseName] = useState(false);

    const toggleSeeCourseName = () => {
        setSeeCourseName(prevState => !prevState);
    };

    return (
        <>
            <div className='flex justify-start my-2 ml-1 gap-2'>
                <ViewCourseButton onClick={toggleSeeCourseName} seeCourseName={seeCourseName} />
                <GroupsNotification />
            </div>
            <div className='border rounded-lg bg-gray-800 mx-1'
                onContextMenu={e => e.preventDefault()}
            >
                <TimeRows />
                <DayRows
                    page={curPage}
                    myProfName={profName}
                    curProf={curProf}
                    profRole={role}
                    profBranch={profBranchTag}
                    branchYear={curBranchYear}
                    seeCourseName={seeCourseName}
                />
            </div>
        </>
    );
};