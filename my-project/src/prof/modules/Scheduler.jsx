import { useGroupsByBranchYear } from "../../context/Prof-Context";

const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 8; hour < 20; hour++) {
        for (let minute = 0; minute < 60; minute += 60) {
            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinute = minute.toString().padStart(2, '0');
            timeSlots.push(`${formattedHour}:${formattedMinute}`);
        }
    }
    return timeSlots;
};

export default function Scheduler({ currentPage, branchYear }) {
    const { data, isLoading, isError } = useGroupsByBranchYear(branchYear);
    return (
        <div className='border rounded-lg bg-gray-800 mx-1'>
            <TimeRows />
            <DayRows groups={data} />
        </div>
    );
};

const TimeRows = () => {
    const timeSlots = generateTimeSlots();

    return (
        <div className='grid grid-cols-26'>
            <div className='col-span-2 border text-white dark:border-gray-700 py-1 pl-1'>
                Day/Time
            </div>
            {timeSlots.map((timeSlot, index) => (
                <div key={index} className='col-span-2 border text-white dark:border-gray-700 py-1 pl-1'>
                    {timeSlot}
                </div>
            ))}
        </div>
    )
}

const TimeBlock = ({ styleStart, styleEnd, codeCurriculum, groupNum, name, lab }) => {
    return (
        <div className={`${styleStart} ${styleEnd} flex flex-col justify-between border rounded p-2 hover:bg-opacity-70 cursor-pointer bg-opacity-100 border-gray-700 bg-green-200`}>
            <p className='flex flex-wrap justify-between mb-2 text-xs md:text-sm'>
                <span>{codeCurriculum}</span>
                <span>SEC: {groupNum}</span>
            </p>
            <div className='flex justify-between text-xs text-gray-700'>
                <div>
                    {name}
                </div>
                <div className='text-right'>
                    {lab}
                </div>
            </div>
        </div>
    );
};

const DayRows = ({ groups }) => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const getColStartClass = (time) => {
        const [hour, minute] = time.split(':').map(str => parseInt(str));

        // Convert the time to fractional hours
        const fractionalHour = hour + (minute / 60);

        // Define the mapping of hours to grid column start values
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
            20: 'col-start-27'
        };

        // Adjust column start for half-hour intervals
        if (minute >= 30) {
            const baseHour = Math.floor(fractionalHour);
            const baseColumn = parseInt(hourToColumnStart[baseHour].split('-')[2]);
            return `col-start-${baseColumn + 1}`;
        }

        // Return the corresponding grid-start class for the hour
        return hourToColumnStart[Math.floor(fractionalHour)] || ''; // Return empty string if hour is not mapped
    };

    const getColEndClass = (time) => {
        const [hour, minute] = time.split(':').map(str => parseInt(str));

        // Convert the time to fractional hours
        const fractionalHour = hour + (minute / 60);

        // Define the mapping of hours to grid column end values
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
            20: 'col-end-27'
        };

        // Adjust column end for half-hour intervals
        if (minute >= 30) {
            const baseHour = Math.floor(fractionalHour);
            const baseColumn = parseInt(hourToColumnEnd[baseHour].split('-')[2]);
            return `col-end-${baseColumn + 1}`;
        }

        // Return the corresponding grid-end class for the hour
        return hourToColumnEnd[Math.floor(fractionalHour)] || ''; // Return empty string if hour is not mapped
    };
    return (
        <>
            {daysOfWeek.map((day, index) => (
                <div key={index} className='grid grid-cols-26 border border-gray-700'>
                    <DayBlock DayText={day} colorStyle={getColorForDay(day)} />
                    {groups && groups.map(group => (
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
        <div className={`grid first-line:p-1 md:p-3 col-start-1 col-end-3 border-r-2 dark:border-gray-700 ${colorStyle}`}>
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