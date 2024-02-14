import React, { useState } from 'react';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Timeline() {
  const [startHour, setStartHour] = useState(8); // Initial start hour
  const [endHour, setEndHour] = useState(20); // Initial end hour
  const timeSlots = generateTimeSlots(startHour, endHour);

  const handleScrollForward = () => {
    if (endHour < 20) {
      setStartHour(startHour + 1);
      setEndHour(endHour + 1);
    }
  };
  
  const handleScrollBackward = () => {
    if (startHour > 8) {
      setStartHour(startHour - 1);
      setEndHour(endHour - 1);
    }
  };
  
  return (
    <div className='overflow-x-auto overflow-y-hidden'> {/* Hide vertical scrollbar */}
      <div className="flex justify-between">
        <button onClick={handleScrollBackward} disabled={startHour <= 0}>Scroll Backward</button>
        <button onClick={handleScrollForward} disabled={endHour >= 24}>Scroll Forward</button>
      </div>
      <table className='min-w-full bg-slate-200 border-collapse'>
        <thead>
          <tr>
            <th className='border p-2'></th>
            {timeSlots.map((time, timeIndex) => (
              <th key={timeIndex} className='border p-2'>{time}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map((day, dayIndex) => (
            <tr key={dayIndex}>
              <td className='border p-2'>{day}</td>
              {timeSlots.map((_, timeIndex) => (
                <td key={`${dayIndex}-${timeIndex}`} className='border p-2'></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const generateTimeSlots = (startHour, endHour) => {
  const timeSlots = [];
  let hour = startHour;
  let minute = 0;

  while (!(hour === endHour && minute === 0)) {
    const formattedHour = hour < 10 ? `0${hour}` : hour;
    const formattedMinute = minute < 10 ? `0${minute}` : minute;
    const time = `${formattedHour}:${formattedMinute}`;
    timeSlots.push(time);

    // Increment time by 30 minutes
    minute += 30;
    if (minute === 60) {
      hour += 1;
      minute = 0;
    }
  }

  return timeSlots;
};
