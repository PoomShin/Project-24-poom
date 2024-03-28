import { useState } from "react";
import { useUserContext } from "../../context/User-Context";
import { useGroupContext } from "../../context/Prof-Context";
import { simplifyTime, checkOverlapWithProf } from "../data_functions/functions";
import { DAYS_OF_WEEK, Time_Options } from "../data_functions/SchedulerData";
import AlertModal from "../../public/AlertModal";

const TextInput = ({ spanText, inputClass, name, value, onChange }) => (
    <div className='flex items-center gap-x-0.5 bg-slate-700 text-black'>
        <label className='text-white'>{spanText}</label>
        <input className={`border rounded-sm text-center ${inputClass}`}
            type='text'
            required
            name={name}
            value={value}
            onChange={onChange}
        />
    </div>
);

const SelectInput = ({ spanText, inputClass, name, value, onChange, options }) => (
    <div className='flex items-center gap-0.5 bg-slate-700 text-black'>
        <label className='text-white'>{spanText}</label>
        <select className={`border border-solid rounded-sm border-cyan-500 text-center appearance-none leading-none ${inputClass}`}
            name={name}
            value={value}
            onChange={onChange}
            required
        >
            <option value='' disabled>{spanText}</option>
            {options.map((option, index) => (
                <option key={index} value={option}>{option}</option>
            ))}
        </select>
    </div>
);

export default function EditGroupForm({ closeEdit, isLab, handleUpdateGroup, group }) {
    const { name: profName } = useUserContext()?.userContextValues || {};
    const { groupsByBranch } = useGroupContext();

    const [updatedGroupData, setUpdatedGroupData] = useState({
        group_id: group.id,
        group_num: group.group_num,
        quantity: group.quantity,
        day_of_week: group.day_of_week,
        start_time: simplifyTime(group.start_time),
        end_time: simplifyTime(group.end_time),
        lab_room: group.lab_room
    });
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedGroupData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        const groupsToCheck = groupsByBranch.filter(group => group.group_id !== updatedGroupData.group_id);

        const overlapWithYourself = checkOverlapWithProf(groupsToCheck, updatedGroupData, profName);

        if (overlapWithYourself) {
            setAlertMessage(`${profName} already has a course at (${updatedGroupData.day_of_week} ${updatedGroupData.start_time}-${updatedGroupData.end_time}).`);
            setIsAlertOpen(true);
        } else {
            handleUpdateGroup(updatedGroupData);
        }
    };

    return (
        <>
            <AlertModal isOpen={isAlertOpen} onClose={() => setIsAlertOpen(false)} message={alertMessage} />
            <form className='p-1 flex flex-col items-center text-xs' onSubmit={handleSubmit}>
                <div className='flex gap-4 justify-center mt-2'>
                    <TextInput spanText='หมู่' inputClass='w-10 h-5' name='group_num' value={updatedGroupData.group_num} onChange={handleChange} />
                    <TextInput spanText='จำนวน' inputClass='w-10 h-5' name='quantity' value={updatedGroupData.quantity} onChange={handleChange} />
                </div>
                <div className='flex gap-4 justify-center mt-2'>
                    <SelectInput spanText='วัน' inputClass='w-12 h-6' name='day_of_week' value={updatedGroupData.day_of_week} onChange={handleChange} options={DAYS_OF_WEEK} />
                    <SelectInput spanText='เริ่ม' inputClass='w-12 h-6' name='start_time' value={updatedGroupData.start_time} onChange={handleChange} options={Time_Options} />
                    <SelectInput spanText='สิ้นสุด' inputClass='w-12 h-6' name='end_time' value={updatedGroupData.end_time} onChange={handleChange} options={Time_Options} />
                </div>
                <div className='flex gap-4 justify-center mt-2'>
                    {isLab && <TextInput spanText='ห้องแลป' inputClass='w-30 h-5' name='lab_room' value={updatedGroupData.lab_room} onChange={handleChange} />}
                </div>
                <button className='mt-2 px-2 text-left hover:bg-green-700 text-base' type="submit">Save Changes</button>
                <button className='mt-2 px-2 text-left hover:bg-red-700 text-base' type="button" onClick={closeEdit}>Close Edit</button>
            </form>
        </>
    )
}