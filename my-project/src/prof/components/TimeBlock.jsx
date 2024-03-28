import { useState, useMemo } from 'react';
import { useUserContext } from '../../context/User-Context';
import { GRID_COL_DATA } from '../data_functions/SchedulerData';
import TimeBlockContentMenu from '../ContextMenu/TimeBlockContextMenu';

const getColumnClass = (time, type) => {
    const [hours, minutes] = time.split(':').map(parseFloat);
    const numericTime = hours + minutes / 60; // Convert minutes to fractional hours
    return GRID_COL_DATA[type][numericTime] || '';
};

export default function TimeBlock({ bgStyle, group, branchYear, isSeeCourseName, onContextMenu, isOpenContextMenu, onCloseContextMenu }) {
    const { name: thisProfName, role: thisProfRole, branch_tag: thisProfBranch } = useUserContext().userContextValues;
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

    const groupBranchYear = useMemo(() => branchYear.substring(0, 3), [branchYear]);
    const canOpenContextMenu = useMemo(() => thisProfRole === 'prof(SM)' && groupBranchYear === thisProfBranch, [thisProfRole, groupBranchYear, thisProfBranch]);

    const displayNames = useMemo(() => {
        if (!Array.isArray(group.prof_names)) return group.prof_names;
        if (group.prof_names.length === 1) {
            return group.prof_names[0] === thisProfName ? `${thisProfName.split(' ')[0].slice(0, 25)}${thisProfName.length > 25 ? '...' : ''}` : group.prof_names[0].split(' ')[0];
        }
        const otherProfNames = group.prof_names.filter(name => name !== thisProfName).map(name => name.split(' ')[0]).join(', ');
        return `${thisProfName.split(' ')[0]}, ${otherProfNames.slice(0, 25 - thisProfName.length)}${otherProfNames.length > 25 ? '...' : ''}`;
    }, [group.prof_names, thisProfName]);

    const getBorderColorClass = useMemo(() => {
        const borderClass = 'border-2 rounded-sm border-solid border-opacity-100 ';
        return borderClass + (group.group_status === 'waiting' ? 'border-orange-500' : 'border-transparent');
    }, [group.group_status]);

    const handleContextMenu = (event) => {
        event.preventDefault();
        setContextMenuPosition({ x: event.clientX, y: event.clientY });
        onContextMenu(event);
    };
    console.log(group)

    return (
        <>
            <TimeBlockContentMenu
                isOpenContextMenu={isOpenContextMenu}
                canOpenContextMenu={canOpenContextMenu}
                contextMenuPosition={contextMenuPosition}
                handleCloseContextMenu={onCloseContextMenu}
                group={group}
            />
            <div className={`relative inline-flex flex-col justify-between text-xs tracking-tight leading-tight hover:bg-opacity-70 cursor-pointer p-2 
                ${getColumnClass(group.start_time, 'start')} ${getColumnClass(group.end_time, 'end')} ${bgStyle} ${getBorderColorClass}`}
                onContextMenu={canOpenContextMenu ? handleContextMenu : (event) => event.preventDefault()}
            >
                <p className={`flex justify-between font-semibold text-black ${(group.group_status === 'accept' || group.group_status === 'reject') && 'text-white'}`}>
                    <span>{group.combined_code_curriculum}</span>
                    <span>SEC: {group.group_num}</span>
                </p>
                <div className={`flex justify-between underline ${(group.group_status === 'accept' || group.group_status === 'reject') ? 'text-gray-200' : 'text-gray-700'}`}>
                    {isSeeCourseName
                        ? <><div>{group.course_type}</div><div className='text-right'>{group.lab_room}</div></>
                        : <div className='overflow-hidden whitespace-nowrap'>{group.eng_name}</div>
                    }
                </div>
            </div>
        </>
    );
}