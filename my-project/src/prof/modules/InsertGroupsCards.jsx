import React, { useMemo } from 'react';
import { FaTimes } from 'react-icons/fa';
import AddGroup from './AddGroup';

export default function InsertGroupsCards({ creditHours, lectureGroups, labGroups, setLectureGroups, setLabGroups, setDisableSubmit, mergedGroups }) {
    const handleAddGroup = (section, setter) => setter(prevSections => [...prevSections, section]);

    const handleDeleteGroup = (groupNum, isLab) => {
        const setGroups = isLab ? setLabGroups : setLectureGroups;
        setGroups(prevGroups => prevGroups.filter(group => group.group_num !== groupNum));
    };

    const renderGroups = useMemo(() => (headerName, groups, isLab) => (
        <>
            <span className='text-3xl text-white'>{headerName}</span>
            <div className={`h-64 flex overflow-x-auto p-4 ${isLab ? 'bg-orange-100' : 'bg-green-100'}`}>
                {groups.map(group => (
                    <GroupItem key={group.group_num} {...group} isLab={isLab} onDelete={handleDeleteGroup} />
                ))}
                <AddGroup mergedGroups={mergedGroups}
                    onAddSection={section => handleAddGroup(section, isLab ? setLabGroups : setLectureGroups)}
                    creditHours={creditHours} isLab={isLab}
                    setDisableSubmit={setDisableSubmit}
                />
            </div>
        </>
    ), [creditHours, labGroups, lectureGroups, handleAddGroup, setLectureGroups, setLabGroups]);

    return (
        <>
            {creditHours.lectureHours > 0 && (
                renderGroups('Lecture', lectureGroups, false)
            )}
            {creditHours.labHours > 0 && (
                renderGroups('Laboratory', labGroups, true)
            )}
        </>
    );
}

const GroupItem = ({ group_num, quantity, unit, hours, day_of_week, start_time, end_time, prof_name, branch_year, isLab, lab_room, onDelete }) => {
    const renderSpans = (data) => {
        return data.map((item, index) => (
            <span key={index} className='ml-1 mr-1 px-2 bg-gray-500 text-ellipsis text-nowrap' title={item}>{item}</span>
        ));
    };

    return (
        <div className='relative h-full min-w-80 flex flex-col justify-center rounded-md bg-slate-700 mr-4 text-xs text-center'>
            <div className='flex self-center text-white'>
                <span className='ml-4 mr-2 px-2 bg-green-800'>หมู่: {group_num}</span>
                <span className='mr-2 px-2 bg-indigo-800'>จำนวน: {quantity}</span>
                <span className='mr-2 px-2 bg-yellow-800'>หน่วย: {unit}</span>
                <span className='mr-2 px-2 bg-yellow-800'>ชั่วโมง: {hours}</span>
            </div>

            <div className='flex self-center text-white mt-3'>
                <span className='ml-4 mr-2 px-2 bg-red-800'>วัน: {day_of_week}</span>
                <span className='mr-2 px-2 bg-purple-800'>เริ่ม: {start_time}</span>
                <span className='mr-2 px-2 bg-purple-800'>สิ้นสุด: {end_time}</span>
            </div>

            <div className='flex flex-col self-center text-white mt-3'>
                <div className='w-72 flex overflow-x-auto py-2'>
                    <span className='ml-4 mr-1 px-2 bg-gray-800'>อาจารย์: </span>
                    {prof_name && renderSpans(prof_name)}
                </div>
                <div className='w-72 flex overflow-x-auto mt-4'>
                    <span className='ml-4 mr-1 px-2 bg-gray-800'>สาขา:</span>
                    {branch_year && renderSpans(branch_year)}
                </div>
                {isLab &&
                    <div className='mt-4'>
                        <span className='ml-3 mr-4 px-2 bg-gray-800'>ห้องแลป: {lab_room}</span>
                    </div>
                }
            </div>

            <button className='absolute top-0 right-0 m-2 text-red-500' onClick={() => onDelete(group_num, isLab)}>
                <FaTimes />
            </button>
        </div>
    );
}