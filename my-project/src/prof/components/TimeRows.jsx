import React from 'react';
import { Time_Slots } from '../data_functions/SchedulerData';

const TimeRows = () => {
    return (
        <div className='grid grid-cols-34 text-black font-semibold'>
            <div className='col-span-2 border border-gray-700 py-1 pl-1'>
                Day/Time
            </div>
            {Time_Slots.map((timeSlot, index) => (
                <div key={index} className='col-span-2 border border-gray-950 py-1 pl-1'>
                    {timeSlot}
                </div>
            ))}
        </div>
    );
}

export default React.memo(TimeRows);
