import React from "react";

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const generateTimeSlots = () => {
  const timeSlots = [];
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      timeSlots.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return timeSlots;
};

const Timeline = () => {
  const timeSlots = generateTimeSlots();

  return (
    <div className="overflow-x-auto overflow-y-hidden">
      <table className="bg-white">
        <thead>
          <tr>
            <th className="border px-4 py-2"></th>
            {timeSlots.map(time => (
              <th key={time} className="border px-4 py-2">{time}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {daysOfWeek.map(day => (
            <tr key={day}>
              <td className="border px-4 py-2">{day}</td>
              {timeSlots.map(time => (
                <td key={`${day}-${time}`} className="border px-4 py-2"></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Timeline;
