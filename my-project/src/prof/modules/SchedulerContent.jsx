import { useMemo } from "react";
import TimeBlock from "../components/TimeBlock";

const getColStartClass = (time) => {
    const [hour, minute] = time.split(':').map(str => parseInt(str));
    const fractionalHour = hour + (minute / 60);

    const hourToColumnStart = {
        8: 'col-start-3',
        9: 'col-start-5',
        10: 'col-start-7',
        11: 'col-start-9',
        12: 'col-start-11',
        13: 'col-start-13',
        14: 'col-start-15',
        15: 'col-start-17',
        16: 'col-start-19',
        17: 'col-start-21',
        18: 'col-start-23',
        19: 'col-start-25',
        20: 'col-start-27',
        21: 'col-start-29',
        22: 'col-start-31',
        23: 'col-start-33',
        24: 'col-start-35'
    };

    if (minute >= 30) {
        const baseHour = Math.floor(fractionalHour);
        const baseColumn = parseInt(hourToColumnStart[baseHour].split('-')[2]);
        return `col-start-${baseColumn + 1}`;
    }

    return hourToColumnStart[Math.floor(fractionalHour)] || ''; // Return empty string if hour is not mapped
};

const getColEndClass = (time) => {
    const [hour, minute] = time.split(':').map(str => parseInt(str));
    const fractionalHour = hour + (minute / 60);

    const hourToColumnEnd = {
        8: 'col-end-3',
        9: 'col-end-5',
        10: 'col-end-7',
        11: 'col-end-9',
        12: 'col-end-11',
        13: 'col-end-13',
        14: 'col-end-15',
        15: 'col-end-17',
        16: 'col-end-19',
        17: 'col-end-21',
        18: 'col-end-23',
        19: 'col-end-25',
        20: 'col-end-27',
        21: 'col-end-29',
        22: 'col-end-31',
        23: 'col-end-33',
        24: 'col-end-35'
    };

    if (minute >= 30) {
        const baseHour = Math.floor(fractionalHour);
        const baseColumn = parseInt(hourToColumnEnd[baseHour].split('-')[2]);
        return `col-end-${baseColumn + 1}`;
    }

    return hourToColumnEnd[Math.floor(fractionalHour)] || '';
};

export default function DayRows({ groups, page, prof }) {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const filteredGroups = useMemo(() => {
        if (!groups || !Array.isArray(groups)) {
            return [];
        }

        if (page === 'Prof' && prof) {
            return groups.filter(group => group.prof_name === prof);
        }

        return groups;
    }, [groups, page, prof]);

    const sortedGroups = useMemo(() => {
        return [...filteredGroups].sort((a, b) => {
            return new Date(a.start_time) - new Date(b.start_time);
        });
    }, [filteredGroups]);
    console.log(sortedGroups)

    return (
        <>
            {daysOfWeek.map((day, index) => (
                <div key={index}
                    className='grid grid-cols-34 border border-gray-700 overflow-y-scroll max-h-14'
                >
                    <DayBlock DayText={day} colorStyle={getColorForDay(day)} />
                    {filteredGroups && filteredGroups.map(group => (
                        group.day_of_week === day &&
                        <TimeBlock key={group.id}
                            styleStart={getColStartClass(group.start_time)} styleEnd={getColEndClass(group.end_time)}
                            codeCurriculum={group.combined_code_curriculum} groupNum={group.group_num} name={group.prof_name} lab={group.lab_room}
                        />
                    ))}
                </div>
            ))}
        </>
    );
}

const DayBlock = ({ DayText, colorStyle }) => {
    return (
        <div className={`grid first-line:p-1 md:p-3 col-span-2 border-r-2 dark:border-gray-700 ${colorStyle}`}>
            <span className='font-bold dark:text-gray-900'>{DayText}</span>
        </div>
    );
};

const getColorForDay = (dayOfWeek) => {
    const colorMap = {
        'Mon': 'bg-yellow-400',
        'Tue': 'bg-pink-400',
        'Wed': 'bg-green-400',
        'Thu': 'bg-orange-400',
        'Fri': 'bg-blue-400',
        'Sat': 'bg-purple-400',
        'Sun': 'bg-red-400',
    };
    return colorMap[dayOfWeek];
}