import TimelineBlock from "../components/TimeLineBlock";

export default function Scheduler() {
    return (
        <div className='overflow-x-auto border rounded-lg bg-gray-800 mx-1'>
            <TimeRow />
            <DayRows />
        </div>
    );
};

const TimeRow = () => {
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

    const timeSlots = generateTimeSlots();

    return (
        <div className='grid grid-cols-26'>
            <div className='col-span-2 border dark:text-white dark:border-gray-700 py-1 pl-1'>
                Day/Time
            </div>
            {timeSlots.map((timeSlot, index) => (
                <div key={index} className='col-span-2 border dark:text-white dark:border-gray-700 py-1 pl-1'>
                    {timeSlot}
                </div>
            ))}
        </div>
    )
}

const DayRows = () => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <>
            {daysOfWeek.map((day, index) => (
                <div key={index} className='min-h-4 md:min-h-12 grid grid-cols-26 border dark:border-gray-700'>
                    <DayBlock DayText={day} colorStyle={getColorForDay(day)} />
                </div>
            ))}
        </>
    );
}

const DayBlock = ({ DayText, colorStyle }) => {
    return (
        <div className={`first-line:p-1 md:p-3 col-span-2 border-r-2 dark:border-gray-700 ${colorStyle}`}>
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

