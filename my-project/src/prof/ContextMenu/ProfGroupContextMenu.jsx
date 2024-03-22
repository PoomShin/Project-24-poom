import { useState } from "react";
import { FaTimes } from 'react-icons/fa';
import { useDelGroupById, useUpdateGroupById } from "../../api/Profs_API";
import EditGroupForm from "../modules/EditGroupForm";

export default function ProfGroupContextMenu({ group, position, onClose }) {
    const delGroupByIdMutation = useDelGroupById();
    const updateGroupByIdMutation = useUpdateGroupById();

    const { x, y } = position;
    const [isOpenEdit, setIsOpenEdit] = useState(false);

    const openEdit = () => setIsOpenEdit(true);
    const closeEdit = () => setIsOpenEdit(false);

    const handleDeleteGroup = async () => {
        try {
            await delGroupByIdMutation.mutateAsync(group.id);
            onClose();
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    const handleUpdateGroup = async (updatedGroupData) => {
        try {
            await updateGroupByIdMutation.mutateAsync({ groupId: group.id, groupData: updatedGroupData });
            onClose();
        } catch (error) {
            console.error('Error updating group:', error);
        }
    };

    return (
        <div className='sticky bg-slate-800 border border-slate-700 rounded-sm shadow-md text-sm text-white mx-2'
            style={{ top: y + 10, left: x }}
        >
            {!isOpenEdit && (
                <div className='p-1 flex flex-col items-center'>
                    <button className='block w-full py-2 px-4 text-left hover:bg-gray-700' onClick={openEdit}>Edit Group</button>
                    <button className='block w-full py-2 px-4 text-left hover:bg-gray-700' onClick={handleDeleteGroup}>Delete Group</button>
                    <button className='absolute top-0 right-0 mt-1 mr-1 text-white' onClick={onClose}><FaTimes /></button>
                </div>
            )}

            {isOpenEdit && <EditGroupForm closeEdit={closeEdit} isLab={group.lab_room !== ''} handleUpdateGroup={handleUpdateGroup} group={group} />}
        </div>
    );
}
