import { useState } from "react";
import { FaTimes } from 'react-icons/fa';
import { useGroupMutations } from "../data_functions/apiFunctions";
import EditGroupForm from "../modules/EditGroupForm";

export default function ProfGroupContextMenu({ group, position, onClose }) {
    const { handleDeleteGroup, handleUpdateGroup } = useGroupMutations();

    const { x, y } = position;
    const [isOpenEdit, setIsOpenEdit] = useState(false);

    const openEdit = () => setIsOpenEdit(true);
    const closeEdit = () => setIsOpenEdit(false);

    const onDelete = () => handleDeleteGroup(group.id, onClose);
    const onUpdate = (updatedData) => handleUpdateGroup(group.id, updatedData, onClose);

    return (
        <div className='sticky bg-slate-800 border border-slate-700 rounded-sm shadow-md text-sm text-white mx-2' style={{ top: y + 10, left: x }}>
            {!isOpenEdit && (
                <div className='p-1 flex flex-col items-center'>
                    <button className='block w-full py-2 px-4 text-left hover:bg-gray-700' onClick={openEdit}>Edit Group</button>
                    <button className='block w-full py-2 px-4 text-left hover:bg-gray-700' onClick={onDelete}>Delete Group</button>
                    <button className='absolute top-0 right-0 mt-1 mr-1 text-white' onClick={onClose}><FaTimes /></button>
                </div>
            )}
            {isOpenEdit && <EditGroupForm closeEdit={closeEdit} isLab={group.lab_room !== ''} handleUpdateGroup={onUpdate} group={group} />}
        </div>
    );
}
