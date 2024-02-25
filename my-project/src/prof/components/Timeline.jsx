import TimelineBlock from "./TimeLineBlock";

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

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const timeSlots = generateTimeSlots();

export default function Timeline() {
    return (
        <div className='overflow-x-auto border rounded-lg bg-gray-800 mx-1'>
            <div>
                {/* Times row */}
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
                {/* Days row */}
                <div className='min-h-4 grid grid-cols-26 md:min-h-12 border dark:border-gray-700'>
                    <DayBlock DayText={daysOfWeek[0]} colorStyle={'bg-yellow-200'} />
                </div>

                <div className='min-h-4 md:min-h-12 grid grid-cols-26 border dark:border-gray-700'>
                    <DayBlock DayText={daysOfWeek[1]} colorStyle={'bg-pink-400'} />
                </div>

                <div className='min-h-4 md:min-h-12 grid grid-cols-26 border dark:border-gray-700'>
                    <DayBlock DayText={daysOfWeek[2]} colorStyle={'bg-green-400'} />
                </div>

                <div className='min-h-4 md:min-h-12 grid grid-cols-26 border dark:border-gray-700'>
                    <DayBlock DayText={daysOfWeek[3]} colorStyle={'bg-orange-400'} />
                </div>

                <div className='min-h-4 md:min-h-12 grid grid-cols-26 border dark:border-gray-700'>
                    <DayBlock DayText={daysOfWeek[4]} colorStyle={'bg-blue-400'} />
                </div>

                <div className='min-h-4 md:min-h-12 grid grid-cols-26 border dark:border-gray-700'>
                    <DayBlock DayText={daysOfWeek[5]} colorStyle={'bg-purple-400'} />
                </div>

                <div className='min-h-4 md:min-h-12 grid grid-cols-26 border dark:border-gray-700'>
                    <DayBlock DayText={daysOfWeek[6]} colorStyle={'bg-red-400'} />
                </div>
            </div>
        </div>
    );
};

const DayBlock = ({ DayText, colorStyle }) => {
    return (
        <div className={`first-line:p-1 md:p-3 col-span-2 border-r-2 dark:border-gray-700 ${colorStyle}`}>
            <span className='font-bold dark:text-gray-900'>{DayText}</span>
        </div>
    )
}

