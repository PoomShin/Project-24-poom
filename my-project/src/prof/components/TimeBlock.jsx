import { useState } from 'react';
import TimeBlockContentMenu from '../ContextMenu/TimeBlockContextMenu';

const TimeBlock = ({
    colStart,
    colEnd,
    bgStyle,
    group,
    profName,
    profRole,
    profBranch,
    branchYear,
    seeCourseName,
    onContextMenu,
    isOpenContextMenu,
    onCloseContextMenu,
}) => {
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const groupBranchYear = branchYear.substring(0, 3);
    const canOpenContextMenu = profRole === 'prof(SM)' && groupBranchYear === profBranch;

    const handleContextMenu = (event) => {
        event.preventDefault();
        setContextMenuPosition({ x: event.clientX, y: event.clientY });
        onContextMenu(event);
    };

    const disableBrowserMenu = (event) => {
        event.preventDefault();
    };

    const displayNames = Array.isArray(group.prof_names) ? (
        group.prof_names.length > 1 || group.prof_names[0] !== profName ? `${group.prof_names.join(', ').slice(0, 25)}${group.prof_names.join(', ').length > 25 ? '...' : ''}` : profName.slice(0, 25) + (profName.length > 25 ? '...' : '')
    ) : group.prof_names;


    const handleCloseContextMenu = () => {
        onCloseContextMenu(); // Call parent's onCloseContextMenu handler
    };

    const borderColorClass = (() => {
        switch (group.group_status) {
            case 'waiting':
                return 'border-orange-500';
            case 'accept':
                return 'border-green-500';
            case 'reject':
                return 'border-red-500';
            default:
                return 'border-gray-700';
        }
    })();

    return (
        <>
            <TimeBlockContentMenu
                isOpenContextMenu={isOpenContextMenu}
                canOpenContextMenu={canOpenContextMenu}
                contextMenuPosition={contextMenuPosition}
                handleCloseContextMenu={handleCloseContextMenu}
            />
            <div
                className={`${colStart} ${colEnd} ${bgStyle} relative inline-flex flex-col justify-between border rounded hover:bg-opacity-70 cursor-pointer bg-opacity-100 ${borderColorClass} border-2 border-solid border-opacity-100 p-2`}
                onContextMenu={canOpenContextMenu ? handleContextMenu : disableBrowserMenu}
            >
                <p className='flex justify-between text-xs'>
                    <span>{group.combined_code_curriculum}</span>
                    <span>SEC: {group.group_num}</span>
                </p>
                <div className='flex justify-between text-xs leading-none text-gray-700'>
                    {seeCourseName ? (
                        <>
                            <div>{displayNames}</div>
                            <div className='text-right'>{group.lab_room}</div>
                        </>
                    ) : <div>{group.eng_name}</div>}
                </div>
            </div>
        </>
    );
};

export default TimeBlock;