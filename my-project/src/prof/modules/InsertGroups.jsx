import GroupItem from '../components/GroupItem';
import AddGroup from './AddGroup';

const getBackgroundColor = isLab => isLab ? 'bg-orange-100' : 'bg-green-100';

export default function InsertGroups({ creditHours, lectureGroups, labGroups, mergedGroups, handleAddSection, setLectureGroups, setLabGroups, setDisableSubmit }) {
    const renderGroups = (groups, isLab) => (
        <div className={`h-64 flex overflow-x-auto p-4 ${getBackgroundColor(isLab)}`}>
            {groups.map((sec, index) => (
                <GroupItem key={index} {...sec} isLab={isLab} />
            ))}
            <AddGroup mergedGroups={mergedGroups}
                onAddSection={section => handleAddSection(section, isLab ? setLabGroups : setLectureGroups)}
                creditHours={creditHours} isLab={isLab}
                setDisableSubmit={setDisableSubmit}
            />
        </div>
    );

    return (
        <div className='overflow-x-scroll flex flex-col w-10/12'>
            {creditHours.lectureHours > 0 && (
                <>
                    <span className='text-3xl text-white mb-2'>Lecture</span>
                    {renderGroups(lectureGroups, false)}
                </>
            )}
            {creditHours.labHours > 0 && (
                <>
                    <span className='text-3xl text-white mt-8 mb-2'>Laboratory</span>
                    {renderGroups(labGroups, true)}
                </>
            )}
        </div>
    );
}
