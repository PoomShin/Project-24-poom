import { useMemo, useState, useRef, useEffect } from "react";
import { useUserContext } from "../../context/User-Context";
import { useGroupsByBranchYear } from "../../api/Profs_API";
import { DAYS_OF_WEEK, PRIORITY_VALUES, COURSE_TYPE_COLOR_MAP, Days_COLOR_MAP } from "../data/SchedulerData";
import TimeBlock from "../components/TimeBlock";

const getColorForCourseType = (courseType) => COURSE_TYPE_COLOR_MAP[courseType] || 'bg-green-200';

export default function DayRows({ page, curProf, curLab, branchYear, seeCourseName, groupsByBranch }) {
    const { name: myProfName, role: profRole, branch_tag: profBranch } = useUserContext().userContextValues;

    const { data: groupsByBranchYear, refetch: refetchGroupsByBranchYear } = useGroupsByBranchYear(branchYear);
    const contextMenuRef = useRef(null);
    const [fullDayBlock, setFullDayBlock] = useState('');
    const [openContextMenu, setOpenContextMenu] = useState(null);

    const toggleFullDayBlock = (day) => setFullDayBlock(prevDay => prevDay === day ? '' : day);
    const handleCloseContextMenu = () => setOpenContextMenu(null);

    const filterGroupsByPage = (groups) => {
        if (page === 'Prof') {
            return groups.filter(group => Array.isArray(group.prof_names) && group.prof_names.includes(curProf));
        } else if (page === 'Lab') {
            return curLab === "" ? groups.filter(group => group.lab_room !== "") : groups.filter(group => group.lab_room === curLab);
        }
        return groups;
    };

    const sortedGroups = useMemo(() => {
        const groupsToSort = page === 'Lab' ? groupsByBranch : groupsByBranchYear;
        if (!groupsToSort) return {};

        return DAYS_OF_WEEK.reduce((acc, day) => {
            const filteredGroups = filterGroupsByPage(groupsToSort.filter(group => group.day_of_week === day && group.group_status !== 'reject'))
                .sort((a, b) => a.start_time.localeCompare(b.start_time) || a.end_time.localeCompare(b.end_time));
            acc[day] = filteredGroups;
            return acc;
        }, {});
    }, [groupsByBranch, groupsByBranchYear, page, curProf, curLab]);

    const getBgStyle = (group, day) => {
        const allGroupsForDay = sortedGroups[day];
        if (group.group_status === 'accept') return 'bg-emerald-800';
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

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                setOpenContextMenu(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        refetchGroupsByBranchYear();
    }, [branchYear]);

    const handleContextMenu = (event, group) => {
        event.preventDefault();
        setOpenContextMenu({ group, x: event.clientX, y: event.clientY });
    };

    return (
        DAYS_OF_WEEK.map((day, index) => (
            <div key={index} className={`grid grid-cols-34 grid-flow-dense gap-y-2 border border-stone-500 bg-stone-800 overflow-y-auto ${fullDayBlock === day ? 'max-h-72' : 'max-h-16'}`}>
                <DayBlock day={day} onClick={() => toggleFullDayBlock(day)} isActive={fullDayBlock === day} />
                {sortedGroups[day] && sortedGroups[day].map((group, groupIndex) => (
                    <TimeBlock key={`${day}-${groupIndex}`}
                        bgStyle={getBgStyle(group, day)}
                        group={group}
                        myProfName={myProfName}
                        profRole={profRole}
                        profBranch={profBranch}
                        branchYear={branchYear}
                        seeCourseName={seeCourseName}
                        onContextMenu={(event) => handleContextMenu(event, group)}
                        isOpenContextMenu={openContextMenu && openContextMenu.group === group}
                        onCloseContextMenu={handleCloseContextMenu}
                    />
                ))}
            </div>
        ))
    );
}

const DayBlock = ({ day, onClick, isActive }) => (
    <div className={`md:p-3 col-start-1 col-end-3 ${Days_COLOR_MAP[day]} ${isActive ? 'ring ring-sky-300' : ''} cursor-pointer`}
        onClick={onClick}
    >
        <span className=' font-semibold text-black'>{day}</span>
    </div>
);