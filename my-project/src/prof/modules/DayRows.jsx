import { useMemo, useState, useRef, useEffect } from "react";
import { useGroupsByBranchYear } from "../../api/Profs_API";
import { DAYS_OF_WEEK, PRIORITY_VALUES } from "../data/SchedulerData";
import gridColData from "../data/gridColData";
import DayBlock from "../components/DayBlock";
import TimeBlock from "../components/TimeBlock";

const getColumnClass = (time, type) => gridColData[type][parseFloat(time)] || '';

export default function DayRows({ page, myProfName, curProf, curLab, profRole, profBranch, branchYear, seeCourseName, groupsByBranch, groupsByBranchRefetch }) {
    const { data: groupsByBranchYear, refetch } = useGroupsByBranchYear(branchYear);
    const [fullDayBlock, setFullDayBlock] = useState('');
    const [openContextMenu, setOpenContextMenu] = useState(null);
    const contextMenuRef = useRef(null);

    const filterGroupsByPage = (groups) => {
        if (page === 'Prof') {
            return groups.filter(group => Array.isArray(group.prof_names) && group.prof_names.includes(curProf));
        } else if (page === 'Lab') {
            return curLab === "" ? groups.filter(group => group.lab_room !== "") : groups.filter(group => group.lab_room === curLab);
        }
        return groups;
    };

    const toggleFullDayBlock = (day) => {
        setFullDayBlock(prevDay => prevDay === day ? '' : day);
    };

    const getBgStyle = (group, day) => {
        const getColorForCourseType = (courseType) => {
            const colorMap = {
                'เฉพาะบังคับ': 'bg-red-300',
                'เฉพาะเลือก': 'bg-orange-400',
                'เฉพาะทั่วไป': 'bg-yellow-400',
                'อื่นๆ': 'bg-yellow-400',
                'บริการ': 'bg-green-400',
            };
            return colorMap[courseType] || 'bg-green-200';
        };

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

    const handleContextMenu = (event, group) => {
        event.preventDefault();
        setOpenContextMenu({ group, x: event.clientX, y: event.clientY });
    };

    const handleCloseContextMenu = () => {
        setOpenContextMenu(null);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                setOpenContextMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        refetch();
    }, [branchYear]);

    useEffect(() => {
        groupsByBranchRefetch();
    }, [page, curLab]);

    const sortedGroups = useMemo(() => {
        const groupsToSort = page === 'Lab' ? groupsByBranch : groupsByBranchYear;
        if (!groupsToSort) return {};

        return DAYS_OF_WEEK.reduce((acc, day) => {
            const filteredGroups = filterGroupsByPage(groupsToSort.filter(group => group.day_of_week === day))
                .sort((a, b) => a.start_time.localeCompare(b.start_time) || a.end_time.localeCompare(b.end_time));
            acc[day] = filteredGroups;
            return acc;
        }, {});
    }, [groupsByBranch, groupsByBranchYear, page, curProf, curLab]);

    return (
        DAYS_OF_WEEK.map((day, index) => (
            <div key={index} className={`grid grid-cols-34 grid-flow-dense gap-y-2 border border-stone-500 bg-stone-800 overflow-y-auto ${fullDayBlock === day ? 'max-h-72' : 'max-h-16'}`}>
                <DayBlock key={`day-${day}`} day={day} onClick={() => toggleFullDayBlock(day)} isActive={fullDayBlock === day} />
                {sortedGroups[day] && sortedGroups[day].map((group, groupIndex) => (
                    <TimeBlock key={`${day}-${groupIndex}`}
                        colStart={getColumnClass(group.start_time, 'start')}
                        colEnd={getColumnClass(group.end_time, 'end')}
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