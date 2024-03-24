import { useUpdateGroupStatusById } from '../../api/Profs_API';
import { FaTimes } from 'react-icons/fa';

export default function TimeBlockContentMenu({ isOpenContextMenu, canOpenContextMenu, contextMenuPosition, handleCloseContextMenu, group }) {
    const mutation = useUpdateGroupStatusById();

    const handleStatusChange = async (newStatus) => {
        try {
            await mutation.mutateAsync({ groupId: group.group_id, groupStatus: newStatus });
        } catch (error) {
            console.error(`Failed to update group status to ${newStatus}:`, error.message);
        }
    };

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
                            <button className='block w-full py-1 px-2 text-left hover:bg-green-700' onClick={() => handleStatusChange('accept')}>Accept Group</button>
                            <button className='block w-full py-1 px-2 text-left hover:bg-red-700' onClick={() => handleStatusChange('reject')}>Reject Group</button>
                        </>
                    ) : group.group_status === 'accept' || group.group_status === 'reject' ? (
                        <button className='block w-full py-1 px-2 text-left hover:bg-gray-200' onClick={() => handleStatusChange('waiting')}>Reset Group</button>
                    ) : null}
                </div>
            </div>
        )
    );
}