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

export default function Scheduler() {
    return (
        <div className='overflow-x-auto border rounded-lg bg-gray-800 mx-1'>
            <TimeRows />
            <DayRows />
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

const TimeBlock = ({ startHour, endHour }) => {
    let startHourStyle = `col-start-${(startHour - 8) * 2 + 3}`;
    let endHourStyle = `col-end-${(endHour - 8) * 2 + 3}`;
    console.log(startHourStyle, endHourStyle)

    return (
        <div className={` col-start-5 col-end-11 flex-col justify-between border rounded p-2 md:px-3 md:py-2 hover:bg-opacity-70 cursor-pointer bg-opacity-100 border-gray-700 bg-green-200`}>
            <p className='flex flex-wrap justify-between mb-2 text-xs md:text-sm'>
                <span>03603341-60</span>
                <span>SEC:830</span>
            </p>
            <div className='flex justify-between text-xs text-gray-700'>
                <div >
                    กาญจนา เอี่ยมสะอาด
                </div>
                <div className='text-right'>
                    LabDat23
                </div>
            </div>
        </div>
    );
}

const DayRows = () => {
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <>
            {daysOfWeek.map((day, index) => (
                <div key={index} className='min-h-4 md:min-h-12 grid grid-cols-26 border dark:border-gray-700 col-span-3'>
                    <DayBlock DayText={day} colorStyle={getColorForDay(day)} />
                    <TimeBlock startHour={9} endHour={12} />
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

