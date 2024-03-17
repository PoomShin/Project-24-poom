export default function TimeBlockContentMenu({ isOpenContextMenu, canOpenContextMenu, contextMenuPosition, handleCloseContextMenu, groupStatus }) {
    return (
        isOpenContextMenu && canOpenContextMenu && (
            <div className='absolute z-40 bg-white border rounded shadow-md'
                style={{
                    top: contextMenuPosition.y + 10,
                    left: contextMenuPosition.x,
                }}
            >
                <div className='p-2 flex flex-col items-center'>
                    <button className='block w-full py-1 px-2 text-left hover:bg-gray-200'>Accept Group</button>
                    <button className='block w-full py-1 px-2 text-left hover:bg-gray-200'>Delete Group</button>
                    <button className='block w-full py-1 px-2 text-left hover:bg-gray-200' onClick={handleCloseContextMenu}>Close Menu</button>
                </div>
            </div>
        )
    );
}
