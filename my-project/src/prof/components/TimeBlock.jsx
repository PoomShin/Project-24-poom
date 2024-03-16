import { useState } from 'react';
import TimeBlockContentMenu from '../ContextMenu/TimeBlockContextMenu';

const TimeBlock = ({
    colStart,
    colEnd,
    bgStyle,
    group,
    myProfName,
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

    const displayNames = Array.isArray(group.prof_names) ? (
        group.prof_names.length > 1 ? (
            `${myProfName.split(' ')[0]}, ${group.prof_names.filter(name => name !== myProfName).map(name => name.split(' ')[0]).join(', ').slice(0, 25 - myProfName.length)}${group.prof_names.join(', ').length > 25 ? '...' : ''}`
        ) : (
            group.prof_names[0] === myProfName ? `${myProfName.split(' ')[0].slice(0, 25)}${myProfName.length > 25 ? '...' : ''}` : group.prof_names[0].split(' ')[0]
        )
    ) : group.prof_names;

    const handleContextMenu = (event) => {
        event.preventDefault();
        setContextMenuPosition({ x: event.clientX, y: event.clientY });
        onContextMenu(event);
    };

    const disableBrowserMenu = (event) => {
        event.preventDefault();
    };

    const handleCloseContextMenu = () => {
        onCloseContextMenu(); // Call parent's onCloseContextMenu handler
    };

    const borderColorClass = (() => {
        const borderClass = 'border-2 rounded-sm border-solid border-opacity-100 '
        switch (group.group_status) {
            case 'waiting':
                return borderClass + 'border-orange-500';
            case 'accept':
                return borderClass + 'border-transparent';
            case 'reject':
                return borderClass + 'border-transparent';
            default:
                return borderClass + 'border-gray-700';
        }
    })();

    return (
        <>
            <TimeBlockContentMenu
                isOpenContextMenu={isOpenContextMenu}
                canOpenContextMenu={canOpenContextMenu}
                contextMenuPosition={contextMenuPosition}
                handleCloseContextMenu={handleCloseContextMenu}
                groupStatus={group.group_status}
            />
            <div
                className={`${colStart} ${colEnd} ${bgStyle} ${borderColorClass}
                p-2 relative inline-flex flex-col justify-between text-xs tracking-tight leading-tight hover:bg-opacity-70 cursor-pointer`}
                onContextMenu={canOpenContextMenu ? handleContextMenu : disableBrowserMenu}
            >
                <p className={`flex justify-between font-semibold text-black ${(group.group_status === 'accept' || group.group_status === 'reject') && 'text-white'}`}>
                    <span>{group.combined_code_curriculum}</span>
                    <span>SEC: {group.group_num}</span>
                </p>
                <div className={`flex justify-between underline ${(group.group_status === 'accept' || group.group_status === 'reject') ? 'text-gray-200' : 'text-gray-700'}`}>
                    {seeCourseName ? (
                        <>
                            <div>{displayNames}</div>
                            <div className='text-right'>{group.lab_room}</div>
                        </>
                    ) : <div className='overflow-hidden whitespace-nowrap'>{group.eng_name}</div>}
                </div>
            </div>
        </>
    );
};

export default TimeBlock;