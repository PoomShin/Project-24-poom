import { useMemo, useState } from 'react';
import { useAllGroupsByBranch } from '../../api/Profs_API';
import { calculateOverlappingCount } from '../data/functions';
import ViewCourseButton from '../components/viewCourseButton';
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
                <GroupsNotification branch={curBranch} allGroupsStatus={groupsStatus} />
                {curPage !== 'Lab' && <GroupsStatusBar statusCounts={statusCounts} overlap={overlappingCount} />}
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

const GroupsStatusBar = ({ statusCounts, overlap }) => (
    <div className='pt-2 leading-none flex gap-2 items-center text-lg font-bold'>
        <p className='text-yellow-900 underline decoration-yellow-600 rounded-sm'>Waiting: {statusCounts.waiting}</p>
        <p className='text-green-900 underline decoration-green-600 rounded-sm'>Accept: {statusCounts.accept}</p>
        <p className='text-red-900 underline decoration-red-600 rounded-sm'>Reject: {statusCounts.reject}</p>
        <p className='text-neutral-900  underline decoration-neutral-600 rounded-sm'>Overlapping: {overlap}</p>
    </div>
)