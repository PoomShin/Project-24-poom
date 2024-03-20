import { useMemo, useState, useEffect } from 'react';
import { useAllGroupsByBranch } from '../../api/Profs_API';
import { calculateOverlappingCount } from '../data/functions';
import ViewCourseButton from '../components/viewCourseButton';
import GroupsNotification from './GroupsNotification';
import TimeRows from '../components/TimeRows';
import DayRows from "./DayRows";

export default function Scheduler({ selectedPage, selectedBranch, selectedBranchYear, selectedProf, selectedLabRoom, groupsStatus = [] }) {
    const { data: allBranchGroups, refetch: refetchAllBranchGroups } = useAllGroupsByBranch(selectedBranch);

    const [seeCourseName, setSeeCourseName] = useState(true);
    const toggleSeeCourseName = () => setSeeCourseName(prevState => !prevState);

    const filteredGroupsStatus = useMemo(() => {
        const filterFunction = group =>
            group.branch_year === selectedBranchYear && (selectedPage !== 'Prof' || group.profs.includes(selectedProf)) && group.group_status !== 'reject';

        return groupsStatus.filter(filterFunction);
    }, [groupsStatus, selectedBranchYear, selectedPage, selectedProf]);

    const statusCounts = useMemo(() => {
        const counts = { waiting: 0, accept: 0, reject: 0 };
        filteredGroupsStatus.forEach(group => counts[group.group_status]++);
        return counts;
    }, [filteredGroupsStatus]);

    const overlappingCount = useMemo(() => calculateOverlappingCount(filteredGroupsStatus), [filteredGroupsStatus]);

    useEffect(() => {
        refetchAllBranchGroups();
    }, [selectedPage, selectedLabRoom]);

    return (
        <>
            <div className='col-span-8 flex flex-wrap items-center justify-start my-4 ml-1 gap-2'>
                <ViewCourseButton onClick={toggleSeeCourseName} seeCourseName={seeCourseName} />
                <GroupsNotification branch={selectedBranch} allGroupsStatus={groupsStatus} />
                {selectedPage !== 'Lab' && <GroupsStatusBar statusCounts={statusCounts} overlap={overlappingCount} />}
            </div>

            <div className='border bg-light_blue mx-1' onContextMenu={e => e.preventDefault()}>
                <TimeRows />
                <DayRows
                    page={selectedPage}
                    curProf={selectedProf}
                    curLab={selectedLabRoom}
                    branchYear={selectedBranchYear}
                    seeCourseName={seeCourseName}
                    groupsByBranch={allBranchGroups}
                />
            </div>
        </>
    );
};

const GroupsStatusBar = ({ statusCounts, overlap }) => (
    <div className='pt-2 leading-none flex gap-2 items-center text-lg font-bold'>
        <p className='text-yellow-900 underline decoration-yellow-600 rounded-sm'>Waiting: {statusCounts.waiting}</p>
        <p className='text-green-900 underline decoration-green-600 rounded-sm'>Accept: {statusCounts.accept}</p>
        <p className='text-red-900 underline decoration-red-600 rounded-sm'>Reject: {statusCounts.reject}</p>
        <p className='text-neutral-900  underline decoration-neutral-600 rounded-sm'>Overlapping: {overlap}</p>
    </div>
)