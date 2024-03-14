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
        <div className='grid grid-cols-34 text-white'>
            <div className='col-span-2 border border-gray-700 py-1 pl-1'>
                Day/Time
            </div>
            {timeSlots.map((timeSlot, index) => (
                <div key={index} className='col-span-2 border border-gray-700 py-1 pl-1'>
                    {timeSlot}
                </div>
            ))}
        </div>
    );
});

const calculateOverlappingCount = (groupsStatus, curBranchYear) => {
    let overlappingCount = 0;

    const filteredGroupsStatus = groupsStatus.filter(group => group.branch_year === curBranchYear);

    // Group groupsStatus by day_of_week
    const groupedByDay = filteredGroupsStatus.reduce((acc, group) => {
        if (!acc[group.day_of_week]) {
            acc[group.day_of_week] = [];
        }
        acc[group.day_of_week].push(group);
        return acc;
    }, {});

    Object.values(groupedByDay).forEach(groups => {
        const sortedGroups = groups.sort((a, b) => {
            const timeA = a.start_time.split(':').map(Number);
            const timeB = b.start_time.split(':').map(Number);
            return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
        });

        for (let i = 0; i < sortedGroups.length - 1; i++) {
            const group1 = sortedGroups[i];
            const group2 = sortedGroups[i + 1];

            const start1 = group1.start_time.split(':').map(Number);
            const end1 = group1.end_time.split(':').map(Number);
            const start2 = group2.start_time.split(':').map(Number);

            // Check if there is an overlap
            if ((start1[0] < start2[0] || (start1[0] === start2[0] && start1[1] < start2[1])) && (end1[0] > start2[0] || (end1[0] === start2[0] && end1[1] > start2[1]))) {
                overlappingCount++;
            }
        }
    });

    return overlappingCount;
};

export default function Scheduler({ curPage, curBranch, curBranchYear, curProf, userData, groupsStatus = [] }) {
    const { name: profName, role, branch_tag: profBranchTag } = userData;
    const [seeCourseName, setSeeCourseName] = useState(false);

    const toggleSeeCourseName = () => {
        setSeeCourseName(prevState => !prevState);
    };

    const filteredGroupsStatus = useMemo(() => {
        return groupsStatus.filter(group => group.branch_year === curBranchYear);
    }, [groupsStatus, curBranchYear]);

    const statusCounts = useMemo(() => {
        const counts = {
            waiting: 0,
            accept: 0,
            reject: 0
        };
        filteredGroupsStatus.forEach(group => {
            counts[group.group_status]++;
        });
        return counts;
    }, [filteredGroupsStatus]);

    const overlappingCount = useMemo(() => {
        return calculateOverlappingCount(groupsStatus, curBranchYear);
    }, [groupsStatus, curBranchYear]);

    return (
        <>
            <div className='col-span-8 flex flex-wrap items-center justify-start my-4 ml-1 gap-2'>
                <ViewCourseButton onClick={toggleSeeCourseName} seeCourseName={seeCourseName} />
                <GroupsNotification isDisable={curBranch !== profBranchTag} allGroupsStatus={groupsStatus} />
                <div className='pt-2 leading-none flex gap-2 items-center text-lg font-bold'>
                    <p className='text-yellow-900 underline decoration-yellow-600 rounded-sm'>Waiting: {statusCounts.waiting}</p>
                    <p className='text-green-900 underline decoration-green-600 rounded-sm'>Accept: {statusCounts.accept}</p>
                    <p className='text-red-900 underline decoration-red-600 rounded-sm'>Reject: {statusCounts.reject}</p>
                    <p className='text-neutral-900  underline decoration-neutral-600 rounded-sm'>Overlapping: {overlappingCount}</p>
                </div>
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