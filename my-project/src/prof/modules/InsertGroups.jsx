import React, { useMemo } from 'react';
import GroupItem from '../components/GroupItem';
import AddGroup from './AddGroup';

const getBackgroundColor = isLab => isLab ? 'bg-orange-100' : 'bg-green-100';

export default function InsertGroups({ creditHours, lectureGroups, labGroups, mergedGroups, setLectureGroups, setLabGroups, setDisableSubmit }) {
    const handleAddGroup = (section, setter) => setter(prevSections => [...prevSections, section]);

    const handleDeleteGroup = (groupNum, isLab) => {
        if (isLab) {
            setLabGroups(prevLabGroups => prevLabGroups.filter(group => group.group_num !== groupNum));
        } else {
            setLectureGroups(prevLectureGroups => prevLectureGroups.filter(group => group.group_num !== groupNum));
        }
    };

    const renderGroups = useMemo(() => (headerName, groups, isLab) => (
        <>
            <span className='text-3xl text-white'>{headerName}</span>
            <div className={`h-64 flex overflow-x-auto p-4 ${getBackgroundColor(isLab)}`}>
                {groups.map((sec, index) => (
                    <GroupItem key={index} {...sec} isLab={isLab} onDelete={handleDeleteGroup} />
                ))}
                <AddGroup mergedGroups={mergedGroups}
                    onAddSection={section => handleAddGroup(section, isLab ? setLabGroups : setLectureGroups)}
                    creditHours={creditHours} isLab={isLab}
                    setDisableSubmit={setDisableSubmit}
                />
            </div>
        </>
    ), [creditHours, mergedGroups, handleAddGroup, setLectureGroups, setLabGroups]);

    return (
        <div className='overflow-x-scroll flex flex-col gap-y-2 w-10/12'>
            {creditHours.lectureHours > 0 && (
                renderGroups('Lecture', lectureGroups, false)
            )}
            {creditHours.labHours > 0 && (
                renderGroups('Laboratory', labGroups, true)
            )}
        </div>
    );
};
