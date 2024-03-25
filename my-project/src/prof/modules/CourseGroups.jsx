import React, { useState } from 'react';
import { statusMappings } from '../data/SidebarRightData';
import { useContextMenuPosition } from '../CustomHook/useContextMenuPosition';
import CourseGroupContextMenu from '../ContextMenu/CourseGroupContextMenu';
import ProfGroupContextMenu from '../ContextMenu/ProfGroupContextMenu';

export default function CourseGroups({ onContextMenuOpen, isContextMenuOpen, course }) {
    const { contextMenuPosition, calculatePosition } = useContextMenuPosition();
    const [openGroupContextMenuID, setOpenGroupContextMenuID] = useState(null);

    const [isOpenGroups, setIsOpenGroups] = useState(false);

    const handleGroupContextMenu = (groupID) => {
        setOpenGroupContextMenuID(groupID);
    };
    const handleContextMenu = (e) => {
        calculatePosition(e);
        onContextMenuOpen(course.id);
    };

    const handleToggleGroup = (e) => {
        e.preventDefault();
        setIsOpenGroups(prev => !prev);
    };

    const allAccepted = course.groups?.every(group => group.group_status === 'accept');
    const bgColorClass = allAccepted ? 'bg-green-200' : 'bg-orange-200';
    const hoverColorClass = allAccepted ? 'hover:bg-green-300' : 'hover:bg-orange-300';

    return (
        <div className='relative'>
            {isContextMenuOpen && (
                <CourseGroupContextMenu
                    courseId={course.id}
                    position={contextMenuPosition}
                    onClose={() => onContextMenuOpen(null)}
                />
            )}
            <div className={`flex justify-between border-0 border-b-2 border-black font-semibold ${isOpenGroups ? 'border-b' : ''} ${bgColorClass} ${hoverColorClass} cursor-pointer`}
                onClickCapture={handleToggleGroup}
                onContextMenu={handleContextMenu}
            >
                <p className='ml-2'>{course.combined_code_curriculum}</p>
                <p className='mx-2'>{course.course_type}</p>
            </div>
            <div className={`overflow-hidden ${isOpenGroups ? 'h-fit' : 'h-0'}`}>
                {course.groups?.map(group => (
                    <ProfGroup key={group.id} group={group} onContextMenuOpen={handleGroupContextMenu} isContextMenuOpen={openGroupContextMenuID === group.id} />
                ))}
            </div>
        </div>
    );
}

const ProfGroup = React.memo(({ group, onContextMenuOpen, isContextMenuOpen }) => {
    const { contextMenuPosition, calculatePosition } = useContextMenuPosition();

    const handleContextMenu = (e) => {
        calculatePosition(e);
        onContextMenuOpen(group.id);
    };

    const startTime = group.start_time.slice(0, 5);
    const endTime = group.end_time.slice(0, 5);
    const { icon, bgColor, hoverColor } = statusMappings[group.group_status] || statusMappings.default;

    return (
        <div className={`py-1 flex flex-col text-sm font-semibold ${bgColor} ${hoverColor} cursor-pointer`}
            onContextMenu={handleContextMenu}
        >
            <div className='flex justify-between mx-3'>
                <img src={icon} alt='Status Icon' className='h-6' />
                <p>{group.day_of_week}</p>
                <p>{startTime}-{endTime}</p>
                <p>Sec:{group.group_num}</p>
            </div>
            <div className='flex overflow-x-auto mt-1'>
                {group.branch_years?.map((branchYear, index) => (
                    <p key={index} className='rounded-sm bg-indigo-900 text-yellow-200 text-xs ml-2 p-1'>
                        {branchYear}
                    </p>
                ))}
            </div>
            {isContextMenuOpen && (
                <ProfGroupContextMenu
                    group={group}
                    position={contextMenuPosition}
                    onClose={() => onContextMenuOpen(null)}
                />
            )}
        </div>
    );
});