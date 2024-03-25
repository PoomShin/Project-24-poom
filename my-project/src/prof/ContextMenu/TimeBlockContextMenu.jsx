import { useGroupMutations } from '../data_functions/apiFunctions';
import { FaTimes } from 'react-icons/fa';

export default function TimeBlockContentMenu({ isOpenContextMenu, canOpenContextMenu, contextMenuPosition, handleCloseContextMenu, group }) {
    const { handleGroupStatusChange } = useGroupMutations();

    const onChangeStatus = (newStatus) => handleGroupStatusChange(group.group_id, newStatus);

    return (
        isOpenContextMenu && canOpenContextMenu &&
        <div className='absolute z-40 bg-stone-600 border rounded shadow-md shadow-stone-600 text-white font-semibold'
            style={{ top: contextMenuPosition.y + 10, left: contextMenuPosition.x, }}
        >
            <div className='p-2 flex flex-col items-center'>
                <button className='absolute top-1 right-1 focus:outline-none' onClick={handleCloseContextMenu}>
                    <FaTimes size={14} />
                </button>
                {group.group_status === 'waiting' ? (
                    <>
                        <button className='block w-full py-1 px-2 text-left hover:bg-green-700' onClick={() => onChangeStatus('accept')}>Accept Group</button>
                        <button className='block w-full py-1 px-2 text-left hover:bg-red-700' onClick={() => onChangeStatus('reject')}>Reject Group</button>
                    </>
                ) : group.group_status === 'accept' || group.group_status === 'reject' ?
                    <button className='block w-full py-1 px-2 text-left hover:bg-gray-200' onClick={() => onChangeStatus('waiting')}>Reset Group</button>
                    : null}
            </div>
        </div>
    );
}