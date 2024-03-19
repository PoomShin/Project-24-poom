import { useMemo, useState } from 'react';
import { useAllGroupsByBranch } from '../../api/Profs_API';
import ViewCourseButton from '../components/viewCourseButton';
import GroupsStatusBar from '../components/GroupsStatusBar';
import GroupsNotification from './GroupsNotification';
import TimeRows from '../components/TimeRows';
import DayRows from "./DayRows";

export default function Scheduler({ userData, groupsStatus = [], curPage, curBranch, curBranchYear, curProf, curLab }) {
    const { name: profName, role, branch_tag: profBranchTag } = userData;
    const { data: allBranchGroups, refetch: refetchAllBranchGroups } = useAllGroupsByBranch(curBranch);

    const [seeCourseName, setSeeCourseName] = useState(true);
    const toggleSeeCourseName = () => {
        setSeeCourseName(prevState => !prevState);
    };

    const filteredGroupsStatus = useMemo(() => {
        const filterFunction = group =>
            group.branch_year === curBranchYear && (curPage !== 'Prof' || group.profs.includes(curProf)) && group.group_status !== 'reject';

        return groupsStatus.filter(filterFunction);
    }, [groupsStatus, curBranchYear, curPage, curProf]);

    const statusCounts = useMemo(() => {
        const counts = { waiting: 0, accept: 0, reject: 0 };
        filteredGroupsStatus.forEach(group => counts[group.group_status]++);
        return counts;
    }, [filteredGroupsStatus]);

    const overlappingCount = useMemo(() => calculateOverlappingCount(filteredGroupsStatus), [filteredGroupsStatus]);

    return (
        <>
            <div className='col-span-8 flex flex-wrap items-center justify-start my-4 ml-1 gap-2'>
                <ViewCourseButton onClick={toggleSeeCourseName} seeCourseName={seeCourseName} />
                <GroupsNotification isDisable={curBranch !== profBranchTag} allGroupsStatus={groupsStatus} />
                {curPage !== 'Lab' && <GroupsStatusBar waiting={statusCounts.waiting} accept={statusCounts.accept} reject={statusCounts.reject} overlap={overlappingCount} />}
            </div>

            <div className='border bg-light_blue mx-1' onContextMenu={e => e.preventDefault()}>
                <TimeRows />
                <DayRows
                    page={curPage}
                    myProfName={profName}
                    curProf={curProf}
                    curLab={curLab}
                    profRole={role}
                    profBranch={profBranchTag}
                    branchYear={curBranchYear}
                    seeCourseName={seeCourseName}
                    groupsByBranch={allBranchGroups}
                    groupsByBranchRefetch={refetchAllBranchGroups}
                />
            </div>
        </>
    );
};

const calculateOverlappingCount = (filteredGroupsStatus) => {
    let overlappingCount = 0;

    const groupedByDay = filteredGroupsStatus.reduce((acc, group) => {
        acc[group.day_of_week] = acc[group.day_of_week] || [];
        acc[group.day_of_week].push(group);
        return acc;
    }, {});

    Object.values(groupedByDay).forEach(groups => {
        groups.sort((a, b) => {
            const getTime = time => {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            };

            return getTime(a.start_time) - getTime(b.start_time);
        });

        for (let i = 0; i < groups.length - 1; i++) {
            const { start_time: startTimeGroup1, end_time: endTimeGroup1 } = groups[i];
            const { start_time: startTimeGroup2, end_time: endTimeGroup2 } = groups[i + 1];

            const getTime = time => {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            };

            const start1 = getTime(startTimeGroup1);
            const end1 = getTime(endTimeGroup1);
            const start2 = getTime(startTimeGroup2);
            const end2 = getTime(endTimeGroup2);

            if (start1 < end2 && end1 > start2) {
                overlappingCount++;
            }
        }
    });

    return overlappingCount;
};
