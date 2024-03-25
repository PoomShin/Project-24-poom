import { useState, useRef, useEffect, useMemo } from "react";
import { DAYS_OF_WEEK, PRIORITY_VALUES, COURSE_TYPE_COLOR_MAP, Days_COLOR_MAP } from "../data_functions/SchedulerData";
import useSortedGroups from "../CustomHook/useSortedGroups";
import TimeBlock from "../components/TimeBlock";

const getColorForCourseType = (courseType) => COURSE_TYPE_COLOR_MAP[courseType] || 'bg-green-200';

const getBgStyle = (group, day, sortedGroups) => {
    const allGroupsForDay = sortedGroups[day];
    if (group.group_status === 'accept') return 'bg-emerald-800';
    if (group.group_status === 'reject') return 'bg-rose-800';
    const overlappingGroups = allGroupsForDay.filter(otherGroup =>
        (group.start_time >= otherGroup.start_time && group.start_time < otherGroup.end_time) ||
        (group.end_time > otherGroup.start_time && group.end_time <= otherGroup.end_time) ||
        (group.start_time <= otherGroup.start_time && group.end_time >= otherGroup.end_time)
    );
    if (overlappingGroups.length > 1) {
        const highestPriority = Math.max(...overlappingGroups.map(g => PRIORITY_VALUES[g.course_type]));
        const highestPriorityCourseType = Object.keys(PRIORITY_VALUES).find(key => PRIORITY_VALUES[key] === highestPriority);
        return getColorForCourseType(highestPriorityCourseType);
    }
    return 'bg-slate-300';
};

const DayBlock = ({ day, onClick, isActive }) => (
    <div className={`md:p-3 col-start-1 col-end-3 ${Days_COLOR_MAP[day]} ${isActive ? 'ring ring-sky-300' : ''} cursor-pointer`}
        onClick={onClick}
    >
        <span className=' font-semibold text-black'>{day}</span>
    </div>
);

export default function DayRows({ page, sharedState, isSeeCourseName }) {
    const { currentBranch, currentBranchYear, currentProfName, currentLabRoom } = sharedState;
    const sortedGroups = useSortedGroups({ page, currentBranch, currentBranchYear, currentProfName, currentLabRoom });

    const contextMenuRef = useRef(null);
    const [fullDayBlock, setFullDayBlock] = useState('');
    const [openContextMenu, setOpenContextMenu] = useState(null);

    const toggleFullDayBlock = (day) => setFullDayBlock(prevDay => prevDay === day ? '' : day);
    const handleCloseContextMenu = () => setOpenContextMenu(null);

    const handleContextMenu = (event, group) => {
        event.preventDefault();
        setOpenContextMenu({ group, x: event.clientX, y: event.clientY });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                setOpenContextMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return useMemo(() => DAYS_OF_WEEK.map((day, index) => (
        <div key={index} className={`grid grid-cols-34 grid-flow-dense gap-y-2 border border-stone-500 bg-stone-800 overflow-y-auto ${fullDayBlock === day ? 'max-h-72' : 'max-h-16'}`}>
            <DayBlock day={day} onClick={() => toggleFullDayBlock(day)} isActive={fullDayBlock === day} />
            {sortedGroups[day] && sortedGroups[day].map((group, groupIndex) => (
                <TimeBlock key={`${day}-${groupIndex}`}
                    bgStyle={getBgStyle(group, day, sortedGroups)}
                    group={group}
                    branchYear={currentBranchYear}
                    isSeeCourseName={isSeeCourseName}
                    onContextMenu={(event) => handleContextMenu(event, group)}
                    isOpenContextMenu={openContextMenu && openContextMenu.group === group}
                    onCloseContextMenu={handleCloseContextMenu}
                />
            ))}
        </div>
    )), [DAYS_OF_WEEK, sortedGroups, fullDayBlock, isSeeCourseName, currentBranchYear, openContextMenu]);
}