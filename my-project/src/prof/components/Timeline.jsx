import { useState } from "react";

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
    const initialTimelineData = daysOfWeek.map(day => Array(timeSlots.length).fill(false));
    const [timelineData, setTimelineData] = useState(initialTimelineData);

    const handleShowTimeline = (day, startHour, endHour) => {
        const startIndex = Math.ceil((startHour - 8) * 2);
        const endIndex = Math.ceil((endHour - 8) * 2) + 1;

        const newTimelineData = [...timelineData];
        const dayIndex = daysOfWeek.indexOf(day);

        let overlapCount = 0;

        for (let i = startIndex; i < endIndex; i++) {
            if (newTimelineData[dayIndex][i]) {
                overlapCount++;
            }
            newTimelineData[dayIndex][i] = true;
        }

        // Update the count of overlapping cells in the first row of timelineData
        for (let i = startIndex; i < endIndex; i++) {
            if (newTimelineData[0][i] !== false) {
                newTimelineData[0][i] += overlapCount;
            } else {
                newTimelineData[0][i] = overlapCount;
            }
        }

        setTimelineData(newTimelineData);
    };

    return (
        <div className="overflow-x-auto overflow-y-hidden">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4" onClick={() => handleShowTimeline('Monday', 8, 10)}>
                Insert Timeline for Monday 8:00 AM to 12:00 PM
            </button>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-4" onClick={() => handleShowTimeline('Monday', 8, 10)}>
                Test Overlapping
            </button>

            <table className="bg-white">
                <thead>
                    <tr>
                        <th className="border px-4 py-2"></th>
                        {timeSlots.map((time, index) => (
                            <th key={index} className="border px-4 py-2">
                                {time}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {daysOfWeek.map((day, dayIndex) => (
                        <tr key={day} id={day}>
                            <td className="border px-4 py-2">{day}</td>
                            {timelineData[dayIndex].map((isFilled, index) => (
                                <td key={`${day}-${index}`} className={`border px-4 py-2 ${isFilled && timelineData[0][index] > 1 ? 'bg-red-500' : isFilled ? 'bg-blue-200' : ''}`}>
                                    {isFilled ? 'Content' : null}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Timeline;
