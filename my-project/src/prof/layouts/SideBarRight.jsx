import React, { useState } from 'react';
import { useCoursesContext } from '../../context/Prof-Context';
import { PRIORITY_VALUES } from '../data/SchedulerData';
import waitingIcon from '../../assets/more.png';
import acceptIcon from '../../assets/accept.png';
import rejectIcon from '../../assets/decline.png';
import filterIcon from '../../assets/filter.png';

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
    const [type, setType] = useState(null);
    const [filterCriteria, setFilterCriteria] = useState({
        courseCodeToggle: 'min',
        curriculumToggle: 'min',
        typeToggle: 'min',
    });

    const slideDown = 'transition-all ease-in-out duration-300';
    const myGroupClass = isMyGroupsOpen ? 'h-dvh' : 'h-0';

    const handleToggleMyGroups = (e) => {
        e.preventDefault();
        setIsMyGroupsOpen(prev => !prev);
    };

    const handleToggleFilter = (type) => {
        setType(type)
        setFilterCriteria(prev => ({
            ...prev,
            [type]: prev[type] === 'min' ? 'max' : 'min'
        }));
    };

    const sortCourses = (a, b) => {
        const [courseCodeA, curriculumA] = a.combined_code_curriculum.split('-');
        const [courseCodeB, curriculumB] = b.combined_code_curriculum.split('-');

        if (type === 'courseCodeToggle') {
            return filterCriteria.courseCodeToggle === 'min' ?
                courseCodeA.localeCompare(courseCodeB) : courseCodeB.localeCompare(courseCodeA);
        } else if (type === 'curriculumToggle') {
            return filterCriteria.curriculumToggle === 'min' ?
                curriculumA.localeCompare(curriculumB) : curriculumB.localeCompare(curriculumA);
        } else if (type === 'typeToggle') {
            return filterCriteria.typeToggle === 'min' ?
                PRIORITY_VALUES[a.course_type] - PRIORITY_VALUES[b.course_type] :
                PRIORITY_VALUES[b.course_type] - PRIORITY_VALUES[a.course_type];
        } else {
            return profCourses;
        }
    };

    const filteredCourses = profCourses ? profCourses.slice().sort(sortCourses) : []

    return (
        <div className='col-start-18 col-span-3 border-t-2 border-black bg-gradient-to-b from-ghost_white to-burnt_sienna/20'
            onContextMenu={e => e.preventDefault()}
        >
            <div className='bg-burnt_sienna/80 hover:bg-burnt_sienna/90 py-1 cursor-pointer' onClick={handleToggleMyGroups}>
                <p className='sm:text-xl text-lg font-semibold text-center text-white'>My Groups</p>
            </div>
            <div className='flex justify-evenly shadow-md shadow-gray-950 bg-burnt_sienna/40 text-xs py-1'>
                <img src={filterIcon} alt='filter icon' className='h-6 ml-2' />
                <FilterButton filterName='Course' filterCriteria={filterCriteria.courseCodeToggle} onClick={() => handleToggleFilter('courseCodeToggle')} />
                <FilterButton filterName='Curriculum' filterCriteria={filterCriteria.curriculumToggle} onClick={() => handleToggleFilter('curriculumToggle')} />
                <FilterButton filterName='Type' filterCriteria={filterCriteria.typeToggle} onClick={() => handleToggleFilter('typeToggle')} />
            </div>
            <div className={`overflow-y-auto flex flex-col ${slideDown} ${myGroupClass} custom-scrollbar`}>
                {filteredCourses.map((course, index) => (
                    <CourseGroups key={course.id} course={course} colorIndex={index} />
                ))}
            </div>
        </div >
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

const ProfGroup = React.memo(({ group }) => {
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
                {group.branch_years.length > 0 && group.branch_years.map((branchYear, index) => (
                    <BranchYearItems key={index} branchYear={branchYear} />
                ))}
            </div>
        </div>
    );
});

const BranchYearItems = ({ branchYear }) => {
    return (
        <p className='rounded-sm bg-indigo-900 text-yellow-200 text-xs ml-2 p-1'>
            {branchYear}
        </p>
    );
}

const FilterButton = ({ filterName, filterCriteria, onClick }) => {
    return (
        <button className={`px-1 border border-gray-600 shadow-sm shadow-black text-white bg-gray-700 ${filterCriteria === 'min' ? 'bg-gradient-to-b from-blue-600 to-gray-600' : 'bg-gradient-to-t from-blue-600 to-gray-600'}`}
            onClick={onClick}
        >
            {filterName}
        </button>
    )
}