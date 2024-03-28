import { useMemo, useState } from 'react';
import { calculateOverlappingCount } from '../data_functions/functions';
import DayRows from "./DayRows";
import TimeRows from '../components/TimeRows';
import GroupsNotification from './GroupsNotification';
import ViewCourseButton from '../components/viewCourseButton';

const GroupsStatusBar = ({ statusCounts, overlap }) => (
    <div className='pt-2 leading-none flex gap-2 items-center text-lg font-bold'>
        <p className='text-gray-900 underline decoration-gray-700 rounded-sm'>Waiting: {statusCounts.waiting}</p>
        <p className='text-green-900 underline decoration-green-600 rounded-sm'>Accept: {statusCounts.accept}</p>
        <p className='text-red-900 underline decoration-red-600 rounded-sm'>Reject: {statusCounts.reject}</p>
        <p className='text-yellow-900  underline decoration-yellow-600 rounded-sm'>Overlapping: {overlap}</p>
    </div>
)

export default function Scheduler({ selectedPage, sharedState, groupsStatus = [] }) {
    const { currentBranch: selectedBranch, currentBranchYear: selectedBranchYear, currentProfName: selectedProfName } = sharedState

    const [isSeeCourseName, setIsSeeCourseName] = useState(true);

    const toggleSeeCourseName = () => setIsSeeCourseName(prevState => !prevState);

    const filteredGroupsStatus = useMemo(() => {
        const filterFunction = group =>
            group.branch_year === selectedBranchYear &&
            (selectedPage !== 'Prof' ? group.group_status !== 'reject' : group.profs.includes(selectedProfName));

        return groupsStatus.filter(filterFunction);
    }, [groupsStatus, selectedBranchYear, selectedPage, selectedProfName]);

    const statusCounts = useMemo(() => {
        const counts = { waiting: 0, accept: 0, reject: 0 };
        filteredGroupsStatus.forEach(group => counts[group.group_status]++);
        return counts;
    }, [filteredGroupsStatus]);

    const overlappingCount = useMemo(() => calculateOverlappingCount(filteredGroupsStatus), [filteredGroupsStatus]);

    return (
        <>
            <div className='col-span-8 flex flex-wrap items-center justify-start my-4 ml-1 gap-2'>
                <ViewCourseButton onClick={toggleSeeCourseName} isSeeCourseName={isSeeCourseName} />
                <GroupsNotification branch={selectedBranch} groupsStatus={groupsStatus} />
                {selectedPage !== 'Lab' && <GroupsStatusBar statusCounts={statusCounts} overlap={overlappingCount} />}
            </div>

            <div className='border bg-light_blue mx-1' onContextMenu={e => e.preventDefault()}>
                <TimeRows />
                <DayRows
                    page={selectedPage}
                    sharedState={sharedState}
                    isSeeCourseName={isSeeCourseName}
                />
            </div>
        </>
    );
};