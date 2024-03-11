import { useState, useEffect } from "react";

const TimeBlock = ({
    colStart,
    colEnd,
    bgStyle,
    group,
    profName,
    profRole,
    profBranch,
    seeCourseName,
    onContextMenu,
    isOpenContextMenu,
    onCloseContextMenu
}) => {
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleContextMenu = (event) => {
            event.preventDefault();
            setContextMenuPosition({ x: event.clientX, y: event.clientY });
            onContextMenu(event);
        };

        if (isOpenContextMenu) {
            document.addEventListener("contextmenu", handleContextMenu);

            return () => {
                document.removeEventListener("contextmenu", handleContextMenu);
            };
        }
    }, [isOpenContextMenu, onContextMenu]);

    const displayNames = Array.isArray(group.prof_names) ? (group.prof_names.length > 1 || group.prof_names[0] !== profName ? `${group.prof_names.join(', ').slice(0, 25)}${group.prof_names.join(', ').length > 25 ? '...' : ''}` : profName.slice(0, 25) + (profName.length > 25 ? '...' : '')) : group.prof_names;

    const handleCloseContextMenu = () => {
        onCloseContextMenu(); // Call parent's onCloseContextMenu handler
    };

    const canOpenContextMenu = profRole === "prof(SM)" && group.owner_branch_tag === profBranch;

    return (
        <>
            {isOpenContextMenu && canOpenContextMenu && (
                <div
                    className="absolute z-50 bg-white border rounded shadow-md"
                    style={{
                        top: contextMenuPosition.y + 10, // Adjust the top position to position it below the mouse cursor
                        left: contextMenuPosition.x,
                    }}
                >
                    <div className="p-2">
                        <p className="">Context Menu</p>
                        <button className="block w-full py-1 px-2 text-left hover:bg-gray-200">Accept Group</button>
                        <button className="block w-full py-1 px-2 text-left hover:bg-gray-200">Delete Group</button>
                        <button className="block w-full py-1 px-2 text-left hover:bg-gray-200" onClick={handleCloseContextMenu}>Close Menu</button>
                    </div>
                </div>
            )}

            <div
                className={`${colStart} ${colEnd} ${bgStyle} relative inline-flex flex-col justify-between border rounded hover:bg-opacity-70 cursor-pointer bg-opacity-100 border-gray-700 p-2`}
                onContextMenu={canOpenContextMenu ? onContextMenu : undefined}
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

