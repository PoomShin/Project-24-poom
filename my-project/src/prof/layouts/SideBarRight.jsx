import { useState } from 'react';
import { useCoursesContext } from '../../context/Prof-Context';
import waitingIcon from '../../assets/more.png';

const slideDown = 'transition-all ease-in-out duration-300 ';

export default function SideBarRight() {
    const { profCourses } = useCoursesContext();
    const [isMyGroupsOpen, setIsMyGroupsOpen] = useState(true);
    const myGroupClass = isMyGroupsOpen ? 'h-dvh' : 'h-0';

    const handleToggleMyGroups = (e) => {
        e.preventDefault();
        setIsMyGroupsOpen(prev => !prev);
    };

    return (
        <div className='col-start-18 col-span-3 border-t-2 border-black bg-ghost_white'>
            <div className='bg-burnt_sienna/65 hover:bg-burnt_sienna/75 pt-6 pb-5 cursor-pointer' onClick={handleToggleMyGroups} onContextMenu={e => e.preventDefault()} >
                <p className='sm:text-xl font-semibold text-center text-white'>My Groups</p>
            </div>
            <div className={'overflow-y-auto flex flex-col ' + slideDown + myGroupClass}>
                {profCourses && profCourses.map(course => <CourseGroups key={course.id} course={course} />)}
            </div>
        </div>
    );
}

const CourseGroups = ({ course }) => {
    const [isOpen, setIsOpen] = useState(false);
    const myCourseClass = isOpen ? 'h-fit' : 'h-0';

    return (
        <div className={'border-t-2 border-black bg-gray-200'}>
            <div className='flex justify-between' onClickCapture={() => setIsOpen(prev => !prev)}>
                <p className='ml-2'>{course.combined_code_curriculum}</p>
                <p className='mx-2'>{course.course_type}</p>
            </div>
            <div className={'overflow-hidden ' + myCourseClass}>
                {course.groups.map(group => <ProfGroup key={group.id} group={group} />)}
            </div>
        </div>
    );
}

const ProfGroup = ({ group }) => {
    const startTime = group.start_time.slice(0, 5);
    const endTime = group.end_time.slice(0, 5);

    return (
        <div className='flex flex-col ring-1 ring-red-300 py-1'>
            <div className='flex justify-between mx-3'>
                <img src={waitingIcon} alt='Waiting Icon' className='h-6' />
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
