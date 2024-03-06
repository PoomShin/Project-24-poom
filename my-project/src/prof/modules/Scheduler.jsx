import { useGroupsByBranchYear } from "../../context/Prof-Context";
import DayRows from "./SchedulerContent";

const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 8; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 60) {
            const formattedHour = hour.toString().padStart(2, '0');
            const formattedMinute = minute.toString().padStart(2, '0');
            timeSlots.push(`${formattedHour}:${formattedMinute}`);
        }
    }
    return timeSlots;
};

export default function Scheduler({ currentPage, branchYear, currentProf }) {
    const { data: branchYearGroups, isLoading, isError } = useGroupsByBranchYear(branchYear);
    console.log(branchYearGroups)

    return (
        <div className='border rounded-lg bg-gray-800 mx-1'>
            <TimeRows />
            <DayRows groups={branchYearGroups} page={currentPage} prof={currentProf} />
        </div>
    );
};

const TimeRows = () => {
    const timeSlots = generateTimeSlots();

    return (
        <div className='grid grid-cols-34'>
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