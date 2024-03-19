import React, { useState, useMemo } from 'react';
import { useCoursesContext } from '../../context/Prof-Context';
import { PRIORITY_VALUES } from '../data/SchedulerData';
import { statusMappings } from '../data/SidebarRightData';
import FilterButton from '../components/FilterButton';
import CourseGroupContextMenu from '../ContextMenu/CourseGroupContextMenu';
import ProfGroupContextMenu from '../ContextMenu/ProfGroupContextMenu';
import filterIcon from '../../assets/filter.png';

const CourseGroups = ({ onContextMenuOpen, isContextMenuOpen, id, combined_code_curriculum, course_type, groups }) => {
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const handleGroupContextMenu = (groupID) => {
        setOpenGroupContextMenuID(groupID);
    }

    const [openGroupContextMenuID, setOpenGroupContextMenuID] = useState(null);
    const handleContextMenu = (e) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = rect.width / 2 - 40;
        const offsetY = rect.height / 2;
        setContextMenuPosition({ x: offsetX, y: offsetY });
        onContextMenuOpen(id); // Notify the parent component that the context menu is open
    };

    const [isOpenGroups, setIsOpenGroups] = useState(false);
    const handleToggleGroup = (e) => {
        e.preventDefault();
        setIsOpenGroups(prev => !prev);
    };

    const allAccepted = groups?.every(group => group.group_status === 'accept');
    const bgColorClass = allAccepted ? 'bg-green-200' : 'bg-orange-200';
    const hoverColorClass = allAccepted ? 'hover:bg-green-300' : 'hover:bg-orange-300';

    return (
        <div className='relative'>
            {isContextMenuOpen && (
                <CourseGroupContextMenu
                    courseId={id}
                    position={contextMenuPosition}
                    onClose={() => onContextMenuOpen(null)}
                />
            )}
            <div className={`flex justify-between border-0 border-b-2 border-black font-semibold ${isOpenGroups ? 'border-b' : ''} ${bgColorClass} ${hoverColorClass} cursor-pointer`}
                onClickCapture={handleToggleGroup}
                onContextMenu={handleContextMenu}
            >
                <p className='ml-2'>{combined_code_curriculum}</p>
                <p className='mx-2'>{course_type}</p>
            </div>
            <div className={`overflow-hidden ${isOpenGroups ? 'h-fit' : 'h-0'}`}>
                {groups?.map(group => (
                    <ProfGroup key={group.id} group={group} onContextMenuOpen={handleGroupContextMenu} isContextMenuOpen={openGroupContextMenuID === group.id} />
                ))}
            </div>
        </div>
    );
};

const ProfGroup = React.memo(({ group, onContextMenuOpen, isContextMenuOpen }) => {
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

    const handleContextMenu = (e) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const offsetX = rect.width / 2 - 40;
        const offsetY = rect.height / 2 - 60;
        setContextMenuPosition({ x: offsetX, y: offsetY });
        onContextMenuOpen(group.id);
    };

    const startTime = group.start_time.slice(0, 5);
    const endTime = group.end_time.slice(0, 5);
    const { icon, bgColor, hoverColor } = statusMappings[group.group_status] || statusMappings.default;

    return (
        <div className={`py-1 flex flex-col text-sm font-semibold ${bgColor} ${hoverColor} cursor-pointer`}
            onContextMenu={handleContextMenu}
        >
            <div className='flex justify-between mx-3'>
                <img src={icon} alt='Status Icon' className='h-6' />
                <p>{group.day_of_week}</p>
                <p>{startTime}-{endTime}</p>
                <p>Sec:{group.group_num}</p>
            </div>
            <div className='flex overflow-x-auto mt-1'>
                {group.branch_years.length > 0 && group.branch_years.map((branchYear, index) => (
                    <p key={index} className='rounded-sm bg-indigo-900 text-yellow-200 text-xs ml-2 p-1'>
                        {branchYear}
                    </p>
                ))}
            </div>
            {isContextMenuOpen && (
                <ProfGroupContextMenu
                    position={contextMenuPosition}
                    onClose={() => onContextMenuOpen(null)}
                />
            )}
        </div>
    );
});

export default function SideBarRight() {
    const { profCourses } = useCoursesContext();

    const [openContextMenuId, setOpenContextMenuId] = useState(null);
    const [isMyGroupsOpen, setIsMyGroupsOpen] = useState(false);
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
                <FilterButton filterName='Course' filterCriteria={filterCriteria.courseCodeToggle} onClick={() => handleFilterToggle('courseCodeToggle')} />
                <FilterButton filterName='Curriculum' filterCriteria={filterCriteria.curriculumToggle} onClick={() => handleFilterToggle('curriculumToggle')} />
                <FilterButton filterName='Type' filterCriteria={filterCriteria.typeToggle} onClick={() => handleFilterToggle('typeToggle')} />
            </div>

            {profCourses && (
                <div className={`overflow-y-auto flex flex-col transition-all ease-in-out duration-300 custom-scrollbar ${isMyGroupsOpen ? 'h-dvh' : 'h-0'}`}>
                    {filteredCourses.map(course => (
                        <CourseGroups key={course.id} {...course} onContextMenuOpen={handleOpenCourseContextMenu} isContextMenuOpen={openContextMenuId === course.id} />
                    ))}
                </div>
            )}
        </div >
    );
};