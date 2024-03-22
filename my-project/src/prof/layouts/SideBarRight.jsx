import React, { useState, useMemo } from 'react';
import { useCoursesContext } from '../../context/Prof-Context';
import { PRIORITY_VALUES } from '../data/SchedulerData';
import CourseGroups from '../modules/CourseGroups';
import filterIcon from '../../assets/filter.png';

const FilterButton = ({ filterName, filterCriteria, onFilter }) => (
    <button className={`px-1 border border-gray-600 shadow-sm shadow-black text-white bg-gray-700 ${filterCriteria === 'min' ? 'bg-gradient-to-b from-blue-600 to-gray-600' : 'bg-gradient-to-t from-blue-600 to-gray-600'}`}
        onClick={onFilter}
    >
        {filterName}
    </button>
);

export default function SideBarRight() {
    const { profCourses } = useCoursesContext();

    const [openContextMenuId, setOpenContextMenuId] = useState(null);
    const [isMyGroupsOpen, setIsMyGroupsOpen] = useState(true);
    const [sortType, setSortType] = useState(null);
    const [filterCriteria, setFilterCriteria] = useState({
        courseCodeToggle: 'min',
        curriculumToggle: 'min',
        typeToggle: 'min',
    });

    const handleToggleMyGroups = () => {
        setIsMyGroupsOpen(prev => !prev);
    };

    const handleFilterToggle = (type) => () => {
        setSortType(type);
        setFilterCriteria(prev => ({
            ...prev,
            [type]: prev[type] === 'min' ? 'max' : 'min'
        }));
    };

    const handleOpenCourseContextMenu = (courseID) => {
        setOpenContextMenuId(courseID);
    };

    const sortCourses = (a, b) => {
        const [courseCodeA, curriculumA] = a.combined_code_curriculum.split('-');
        const [courseCodeB, curriculumB] = b.combined_code_curriculum.split('-');

        if (sortType === 'courseCodeToggle') {
            return filterCriteria.courseCodeToggle === 'min' ?
                courseCodeA.localeCompare(courseCodeB) : courseCodeB.localeCompare(courseCodeA);
        } else if (sortType === 'curriculumToggle') {
            return filterCriteria.curriculumToggle === 'min' ?
                curriculumA.localeCompare(curriculumB) : curriculumB.localeCompare(curriculumA);
        } else if (sortType === 'typeToggle') {
            return filterCriteria.typeToggle === 'min' ?
                PRIORITY_VALUES[a.course_type] - PRIORITY_VALUES[b.course_type] :
                PRIORITY_VALUES[b.course_type] - PRIORITY_VALUES[a.course_type];
        } else {
            return profCourses;
        }
    };

    const filteredCourses = useMemo(() => {
        if (!profCourses) return [];
        return profCourses.slice().sort(sortCourses);
    }, [profCourses, sortType, filterCriteria]);

    return (
        <div className='col-start-18 col-span-3 border-t-2 border-black bg-gradient-to-b from-ghost_white to-burnt_sienna/20' onContextMenu={e => e.preventDefault()}>
            <div className='bg-burnt_sienna/80 hover:bg-burnt_sienna/90 py-1 cursor-pointer' onClick={handleToggleMyGroups}>
                <p className='sm:text-xl text-lg font-semibold text-center text-white'>My Groups</p>
            </div>

            <div className='flex justify-evenly shadow-md shadow-gray-950 bg-burnt_sienna/40 text-xs py-1'>
                <img src={filterIcon} alt='filter icon' className='h-6 ml-2' />
                <FilterButton filterName='Course' filterCriteria={filterCriteria.courseCodeToggle} onFilter={handleFilterToggle('courseCodeToggle')} />
                <FilterButton filterName='Curriculum' filterCriteria={filterCriteria.curriculumToggle} onFilter={handleFilterToggle('curriculumToggle')} />
                <FilterButton filterName='Type' filterCriteria={filterCriteria.typeToggle} onFilter={handleFilterToggle('typeToggle')} />
            </div>

            <div className={`overflow-y-auto flex flex-col transition-all ease-in-out duration-300 custom-scrollbar ${isMyGroupsOpen ? 'h-dvh' : 'h-0'}`}>
                {filteredCourses && filteredCourses.map(course => (
                    <CourseGroups key={course.id} {...course} onContextMenuOpen={handleOpenCourseContextMenu} isContextMenuOpen={openContextMenuId === course.id} />
                ))}
            </div>
        </div >
    );
};