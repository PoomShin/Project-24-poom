import React, { useMemo, useState } from 'react';
import ViewCourseButton from '../components/viewCourseButton';
import { useAllGroupsByBranch } from '../../api/Profs_API';
import GroupsNotification from '../components/GroupsNotification';
import DayRows from "./DayRows";

const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 8; hour < 24; hour++) {
        const formattedHour = hour.toString().padStart(2, '0');
        timeSlots.push(`${formattedHour}:00`);
    }
    return timeSlots;
};

const TimeRows = React.memo(() => {
    const timeSlots = useMemo(() => generateTimeSlots(), []);

    return (
        <div className='grid grid-cols-34 text-black font-semibold'>
            <div className='col-span-2 border border-gray-700 py-1 pl-1'>
                Day/Time
            </div>
            {timeSlots.map((timeSlot, index) => (
                <div key={index} className='col-span-2 border border-gray-950 py-1 pl-1'>
                    {timeSlot}
                </div>
            ))}
        </div>
    );
});

const calculateOverlappingCount = (filteredGroupsStatus) => {
    let overlappingCount = 0;

    const groupedByDay = filteredGroupsStatus.reduce((acc, group) => {
        acc[group.day_of_week] = acc[group.day_of_week] || [];
        acc[group.day_of_week].push(group);
        return acc;
    }, {});

    Object.values(groupedByDay).forEach(groups => {
        const sortedGroups = groups.sort((a, b) => {
            const getTime = time => {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            };

            return getTime(a.start_time) - getTime(b.start_time);
        });

        for (let i = 0; i < sortedGroups.length - 1; i++) {
            const { start_time: startTimeGroup1, end_time: endTimeGroup1 } = sortedGroups[i];
            const { start_time: startTimeGroup2, end_time: endTimeGroup2 } = sortedGroups[i + 1];

            const getTime = time => {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            };

            const start1 = getTime(startTimeGroup1);
            const end1 = getTime(endTimeGroup1);
            const start2 = getTime(startTimeGroup2);
            const end2 = getTime(endTimeGroup2);

            if ((start1 < end2 || (start1 === end2 && end1 < start2)) && (end1 > start2 || (end1 === start2 && start1 > end2))) {
                overlappingCount++;
            }
        }
    });

    return overlappingCount;
};

export default function Scheduler({ curPage, curBranch, curBranchYear, curProf, userData, groupsStatus = [] }) {
    const { name: profName, role, branch_tag: profBranchTag } = userData;
    const { data, refetch } = useAllGroupsByBranch(curBranch);
    const [seeCourseName, setSeeCourseName] = useState(false);

    const filteredGroupsStatus = useMemo(() => {
        const filterFunction = group =>
            group.branch_year === curBranchYear && (curPage !== 'Prof' || group.profs.includes(curProf));

        return groupsStatus.filter(filterFunction);
    }, [groupsStatus, curBranchYear, curPage, curProf]);

    const statusCounts = useMemo(() => {
        const counts = { waiting: 0, accept: 0, reject: 0 };
        filteredGroupsStatus.forEach(group => counts[group.group_status]++);
        return counts;
    }, [filteredGroupsStatus]);

    const overlappingCount = useMemo(() => calculateOverlappingCount(filteredGroupsStatus, curBranchYear), [filteredGroupsStatus, curBranchYear]);

    const toggleSeeCourseName = () => {
        setSeeCourseName(prevState => !prevState);
    };

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

            <div className='border bg-light_blue mx-1'
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
                    groupsByBranch={data}
                    groupsByBranchRefetch={refetch}
                />
            </div>
        </>
    );
};