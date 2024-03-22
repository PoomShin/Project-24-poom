import { FaTimes } from 'react-icons/fa';

export default function TimeBlockContentMenu({ isOpenContextMenu, canOpenContextMenu, contextMenuPosition, handleCloseContextMenu, group }) {
    return (
        isOpenContextMenu && canOpenContextMenu && (
            <div className='absolute z-40 bg-stone-600 border rounded shadow-md shadow-stone-600 text-white font-semibold'
                style={{
                    top: contextMenuPosition.y + 10,
                    left: contextMenuPosition.x,
                }}
            >
                <div className='p-2 flex flex-col items-center'>
                    <button className='absolute top-0 right-0 focus:outline-none' onClick={handleCloseContextMenu}>
                        <FaTimes />
                    </button>
                    {group.group_status === 'waiting' ? (
                        <>
                            <button className='block w-full py-1 px-2 text-left hover:bg-green-700' onClick={() => handleAcceptGroup(group)}>Accept Group</button>
                            <button className='block w-full py-1 px-2 text-left hover:bg-red-700' onClick={() => handleRejectGroup(group)}>Reject Group</button>
                        </>
                    ) : group.group_status === 'accept' ? (
                        <button className='block w-full py-1 px-2 text-left hover:bg-gray-200' onClick={() => handleResetGroup(group)}>Reset Group</button>
                    ) : null}
                </div>
            </div>
        )
    );
}