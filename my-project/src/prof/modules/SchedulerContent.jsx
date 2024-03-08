import { useMemo, useState } from "react";
import TimeBlock from "../components/TimeBlock";

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const PRIORITY_VALUES = {
    'เฉพาะบังคับ': 5,
    'เฉพาะเลือก': 4,
    'เฉพาะทั่วไป': 3,
    'อื่นๆ': 2,
    'บริการ': 1,
};

const COLOR_MAP = {
    'Mon': 'bg-yellow-400',
    'Tue': 'bg-pink-400',
    'Wed': 'bg-green-400',
    'Thu': 'bg-orange-400',
    'Fri': 'bg-blue-400',
    'Sat': 'bg-purple-400',
    'Sun': 'bg-red-400',
};

const getColStartClass = (time) => {
    const [hour, minute] = time.split(':').map(str => parseInt(str));
    const fractionalHour = hour + (minute / 60);

    const hourToColumnStart = {
        8: 'col-start-3',
        8.5: 'col-start-4',
        9: 'col-start-5',
        9.5: 'col-start-6',
        10: 'col-start-7',
        10.5: 'col-start-8',
        11: 'col-start-9',
        11.5: 'col-start-10',
        12: 'col-start-11',
        12.5: 'col-start-12',
        13: 'col-start-13',
        13.5: 'col-start-14',
        14: 'col-start-15',
        14.5: 'col-start-16',
        15: 'col-start-17',
        15.5: 'col-start-18',
        16: 'col-start-19',
        16.5: 'col-start-20',
        17: 'col-start-21',
        17.5: 'col-start-22',
        18: 'col-start-23',
        18.5: 'col-start-24',
        19: 'col-start-25',
        19.5: 'col-start-26',
        20: 'col-start-27',
        20.5: 'col-start-28',
        21: 'col-start-29',
        21.5: 'col-start-30',
        22: 'col-start-31',
        22.5: 'col-start-32',
        23: 'col-start-33',
        23.5: 'col-start-34',
        24: 'col-start-35'
    };

    return hourToColumnStart[fractionalHour] || ''; // Return empty string if hour is not mapped
};

const getColEndClass = (time) => {
    const [hour, minute] = time.split(':').map(str => parseInt(str));
    const fractionalHour = hour + (minute / 60);

    const hourToColumnEnd = {
        8: 'col-end-3',
        8.5: 'col-end-4',
        9: 'col-end-5',
        9.5: 'col-end-6',
        10: 'col-end-7',
        10.5: 'col-end-8',
        11: 'col-end-9',
        11.5: 'col-end-10',
        12: 'col-end-11',
        12.5: 'col-end-12',
        13: 'col-end-13',
        13.5: 'col-end-14',
        14: 'col-end-15',
        14.5: 'col-end-16',
        15: 'col-end-17',
        15.5: 'col-end-18',
        16: 'col-end-19',
        16.5: 'col-end-20',
        17: 'col-end-21',
        17.5: 'col-end-22',
        18: 'col-end-23',
        18.5: 'col-end-24',
        19: 'col-end-25',
        19.5: 'col-end-26',
        20: 'col-end-27',
        20.5: 'col-end-28',
        21: 'col-end-29',
        21.5: 'col-end-30',
        22: 'col-end-31',
        22.5: 'col-end-32',
        23: 'col-end-33',
        23.5: 'col-end-34',
        24: 'col-end-35'
    };

    return hourToColumnEnd[fractionalHour] || '';
};

export default function DayRows({ groups, page, profName, seeCourseName }) {
    const [fullDayBlock, setFullDayBlock] = useState('');

    const sortedGroups = useMemo(() => {
        if (!groups) return {};
        return DAYS_OF_WEEK.reduce((acc, day) => {
            acc[day] = groups.filter(group => group.day_of_week === day)
                .sort((a, b) => a.start_time.localeCompare(b.start_time) || a.end_time.localeCompare(b.end_time));
            return acc;
        }, {});
    }, [groups]);

    const toggleFullDayBlock = (day) => {
        setFullDayBlock(prevDay => prevDay === day ? '' : day);
    };

    const getBgStyle = (group, day) => {
        const overlappingGroups = sortedGroups[day].filter(otherGroup =>
            (group.start_time >= otherGroup.start_time && group.start_time < otherGroup.end_time) ||
            (group.end_time > otherGroup.start_time && group.end_time <= otherGroup.end_time) ||
            (group.start_time <= otherGroup.start_time && group.end_time >= otherGroup.end_time)
        );

        if (overlappingGroups.length > 1) {
            const highestPriorityGroup = overlappingGroups.reduce((highest, current) =>
                PRIORITY_VALUES[current.course_type] > PRIORITY_VALUES[highest.course_type] ? current : highest
            );
            return getColorForCourseType(highestPriorityGroup.course_type);
        } else {
            return 'bg-green-400'; // Default background color for no overlap
        }
    };

    const getColorForCourseType = (courseType) => {
        switch (courseType) {
            case 'เฉพาะบังคับ': return 'bg-red-400';
            case 'เฉพาะเลือก': return 'bg-orange-400';
            case 'เฉพาะทั่วไป':
            case 'อื่นๆ': return 'bg-yellow-400';
            case 'บริการ': return 'bg-green-400';
            default: return 'bg-green-200'; // Default background color for no overlap
        }
    };

    return (
        DAYS_OF_WEEK.map((day, index) => (
            <div key={index} className={`grid grid-cols-34 border border-gray-700 overflow-y-scroll grid-flow-dense ${fullDayBlock === day ? 'max-h-fit' : 'max-h-28'}`}>
                <DayBlock day={day} onClick={() => toggleFullDayBlock(day)} isActive={fullDayBlock === day} />
                {
                    sortedGroups[day] && sortedGroups[day].map((group, groupIndex) => (
                        <TimeBlock key={groupIndex}
                            colStart={getColStartClass(group.start_time)}
                            colEnd={getColEndClass(group.end_time)}
                            bgStyle={getBgStyle(group, day)}
                            engName={group.eng_name}
                            codeCurriculum={group.combined_code_curriculum}
                            groupNum={group.group_num}
                            names={group.prof_names} profName={profName}
                            lab={group.lab_room}
                            seeCourseName={seeCourseName}
                        />
                    ))
                }
            </div>
        ))
    );
}

const DayBlock = ({ day, onClick, isActive }) => {
    return (
        <div className={`grid first-line:p-1 md:p-3 col-start-1 col-end-3 border-r-2 dark:border-gray-700 ${COLOR_MAP[day]} ${isActive ? 'hover:border-blue-500 hover:border' : ''}`}
            onClick={onClick}
        >
            <span className='font-bold dark:text-gray-900'>{day}</span>
        </div>
    );
};