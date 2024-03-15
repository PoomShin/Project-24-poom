import { useState } from 'react';
import { useCoursesContext } from '../../context/Prof-Context';
import waitingIcon from '../../assets/more.png';
import acceptIcon from '../../assets/accept.png';
import rejectIcon from '../../assets/decline.png';

const statusMappings = {
    waiting: { icon: waitingIcon, bgColor: 'bg-gray-200' },
    accept: { icon: acceptIcon, bgColor: 'bg-green-200' },
    reject: { icon: rejectIcon, bgColor: 'bg-red-200' },
    default: { icon: waitingIcon, bgColor: 'bg-gray-200' }
};

const groupColors = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-pink-200', 'bg-purple-200', 'bg-orange-200', 'bg-teal-200', 'bg-red-200'];

export default function SideBarRight() {
    const { profCourses } = useCoursesContext();
    const [isMyGroupsOpen, setIsMyGroupsOpen] = useState(true);

    const slideDown = 'transition-all ease-in-out duration-300';
    const myGroupClass = isMyGroupsOpen ? 'h-dvh' : 'h-0';

    const handleToggleMyGroups = (e) => {
        e.preventDefault();
        setIsMyGroupsOpen(prev => !prev);
    };

    return (
        <div className='col-start-18 col-span-3 border-t-2 border-black bg-gradient-to-b from-ghost_white to-burnt_sienna/20'
            onContextMenu={e => e.preventDefault()}
        >
            <div className='bg-burnt_sienna/65 hover:bg-burnt_sienna/75 shadow-md shadow-gray-950 pt-6 pb-5 cursor-pointer' onClick={handleToggleMyGroups}>
                <p className='sm:text-xl text-lg font-semibold text-center text-white'>My Groups</p>
            </div>
            <div className={`overflow-y-auto flex flex-col ${slideDown} ${myGroupClass} custom-scrollbar`}>
                {profCourses && profCourses.map((course, index) => <CourseGroups key={course.id} course={course} colorIndex={index} />)}
            </div>
        </div>
    );
}

const CourseGroups = ({ course, colorIndex }) => {
    const [isOpen, setIsOpen] = useState(false);

    const bgColor = groupColors[colorIndex % groupColors.length];
    const myCourseClass = isOpen ? 'h-fit' : 'h-0';
    const groupBorder = isOpen ? 'border-b' : '';

    const handleToggleGroup = (e) => {
        e.preventDefault();
        setIsOpen(prev => !prev);
    };

    return (
        <div>
            <div className={`flex justify-between border-0 border-b-2 border-black font-semibold cursor-pointer ${groupBorder} ${bgColor}`} onClickCapture={handleToggleGroup}>
                <p className='ml-2'>{course.combined_code_curriculum}</p>
                <p className='mx-2'>{course.course_type}</p>
            </div>
            <div className={`overflow-hidden ${myCourseClass}`}>
                {course.groups && course.groups.map(group => <ProfGroup key={group.id} group={group} />)}
            </div>
        </div>
    );
}

const ProfGroup = ({ group }) => {
    const startTime = group.start_time.slice(0, 5);
    const endTime = group.end_time.slice(0, 5);

    const { icon, bgColor } = statusMappings[group.group_status] || statusMappings.default;

    return (
        <div className={`py-1 flex flex-col font-semibold ${bgColor}`}>
            <div className='flex justify-between mx-3'>
                <img src={icon} alt='Status Icon' className='h-6' />
                <p>{group.num}</p>
                <p>{group.day_of_week}</p>
                <p>{startTime}-{endTime}</p>
            </div>
            <div className='flex overflow-x-auto mt-1'>
                {group.branch_years && group.branch_years.map((branchYear, index) => <BranchYearItems key={index} branchYear={branchYear} />)}
            </div>
        </div>
    );
}

const BranchYearItems = ({ branchYear }) => {
    return (
        <p className='rounded-sm bg-indigo-900 text-yellow-200 text-xs ml-2 p-1'>
            {branchYear}
        </p>
    );
}