import React, { useMemo } from 'react';

const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 8; hour < 24; hour++) {
        const formattedHour = hour.toString().padStart(2, '0');
        timeSlots.push(`${formattedHour}:00`);
    }
    return timeSlots;
};

const TimeRows = () => {
    const timeSlots = useMemo(() => generateTimeSlots(), []);

    return (
        <div className='grid grid-cols-34 text-black font-semibold'>
            <div className='col-span-2 border border-gray-700 py-1 pl-1'>
                Day/Time
            </div>
            {timeSlots.map((timeSlot, index) => (
                <div key={index} className='col-span-2 border border-gray-950 py-1 pl-1'>
                    {timeSlot}
                </div>
            ))}
        </div>
    );
}

export default React.memo(TimeRows);
