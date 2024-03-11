import { useState, useEffect } from "react";

export default function TimeBlock({ colStart, colEnd, bgStyle, engName, codeCurriculum, groupNum, names, lab, profName, seeCourseName, onContextMenu, isOpenContextMenu, onCloseContextMenu }) {
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

    const displayNames = Array.isArray(names) ? (names.length > 1 || names[0] !== profName ? `${names.join(', ').slice(0, 25)}${names.join(', ').length > 25 ? '...' : ''}` : profName.slice(0, 25) + (profName.length > 25 ? '...' : '')) : names;

    const handleCloseContextMenu = () => {
        onCloseContextMenu(); // Call parent's onCloseContextMenu handler
    };

    return (
        <>
            {isOpenContextMenu && (
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

            <div className={`${colStart} ${colEnd} inline-flex flex-col justify-between border rounded hover:bg-opacity-70 cursor-pointer bg-opacity-100 border-gray-700 ${bgStyle} p-2 relative`}
                onContextMenu={isOpenContextMenu ? undefined : onContextMenu} // Disable context menu when it's open
            >
                <p className='flex justify-between text-xs'>
                    <span>{codeCurriculum}</span>
                    <span>SEC: {groupNum}</span>
                </p>
                <div className='flex justify-between text-xs leading-none text-gray-700'>
                    {seeCourseName ? (
                        <>
                            <div>{displayNames}</div>
                            <div className='text-right'>{lab}</div>
                        </>
                    ) : <div>{engName}</div>}
                </div>
            </div>
        </>
    );
}
