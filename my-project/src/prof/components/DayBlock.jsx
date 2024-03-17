import { COLOR_MAP } from "../data/SchedulerData";

export default function DayBlock({ day, onClick, isActive }) {
    return (
        <div className={`md:p-3 col-start-1 col-end-3 ${COLOR_MAP[day]} ${isActive ? 'ring ring-sky-300' : ''} cursor-pointer`}
            onClick={onClick}
        >
            <span className=' font-semibold text-black'>{day}</span>
        </div>
    );
}