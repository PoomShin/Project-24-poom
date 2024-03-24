import React, { useMemo, useCallback, useReducer } from 'react';
import { useCoursesContext } from '../../context/Prof-Context';
import { PRIORITY_VALUES } from '../data/SchedulerData';
import CourseGroups from '../modules/CourseGroups';
import filterIcon from '../../assets/filter.png';

const FilterButton = React.memo(({ filterName, filterCriteria, onFilter }) => {
    return (
        <button
            className={`px-1 border border-gray-600 shadow-sm shadow-black text-white bg-gray-700 ${filterCriteria === 'min' ? 'bg-gradient-to-b from-blue-600 to-gray-600' : 'bg-gradient-to-t from-blue-600 to-gray-600'}`}
            onClick={onFilter}
        >
            {filterName}
        </button>
    );
});

const initialState = {
    openContextMenuId: null,
    isMyGroupsOpen: true,
    sortType: null,
    filterCriteria: {
        courseCodeToggle: 'min',
        curriculumToggle: 'min',
        typeToggle: 'min',
    }
};

const toggleMyGroups = (state) => ({
    ...state,
    isMyGroupsOpen: !state.isMyGroupsOpen
});

const toggleFilter = (state, filterType) => ({
    ...state,
    sortType: filterType,
    filterCriteria: {
        ...state.filterCriteria,
        [filterType]: state.filterCriteria[filterType] === 'min' ? 'max' : 'min'
    }
});

const openContextMenu = (state, courseID) => ({
    ...state,
    openContextMenuId: courseID
});

const reducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE_MY_GROUPS':
            return toggleMyGroups(state);
        case 'TOGGLE_FILTER':
            return toggleFilter(state, action.payload.filterType);
        case 'OPEN_CONTEXT_MENU':
            return openContextMenu(state, action.payload.courseID);
        default:
            return state;
    }
};

export default function SideBarRight() {
    const { profCourses } = useCoursesContext();

    const [state, dispatch] = useReducer(reducer, initialState);

    const handleToggleMyGroups = useCallback(() => {
        dispatch({ type: 'TOGGLE_MY_GROUPS' });
    }, []);
    const handleFilterToggle = useCallback((type) => () => {
        dispatch({ type: 'TOGGLE_FILTER', payload: { filterType: type } });
    }, []);
    const handleOpenCourseContextMenu = useCallback((courseID) => {
        dispatch({ type: 'OPEN_CONTEXT_MENU', payload: { courseID } });
    }, []);

    const sortCourses = useCallback((a, b) => {
        const [courseCodeA, curriculumA] = a.combined_code_curriculum.split('-');
        const [courseCodeB, curriculumB] = b.combined_code_curriculum.split('-');

        if (state.sortType === 'courseCodeToggle') {
            return state.filterCriteria.courseCodeToggle === 'min' ?
                courseCodeA.localeCompare(courseCodeB) : courseCodeB.localeCompare(courseCodeA);
        } else if (state.sortType === 'curriculumToggle') {
            return state.filterCriteria.curriculumToggle === 'min' ?
                curriculumA.localeCompare(curriculumB) : curriculumB.localeCompare(curriculumA);
        } else if (state.sortType === 'typeToggle') {
            return state.filterCriteria.typeToggle === 'min' ?
                PRIORITY_VALUES[a.course_type] - PRIORITY_VALUES[b.course_type] :
                PRIORITY_VALUES[b.course_type] - PRIORITY_VALUES[a.course_type];
        } else {
            return profCourses;
        }
    }, [state.sortType, state.filterCriteria, profCourses]);

    const filteredProfCourses = useMemo(() => {
        return profCourses?.slice().sort(sortCourses) || [];
    }, [profCourses, sortCourses]);

    return (
        <div className='col-start-18 col-span-3 border-t-2 border-black bg-gradient-to-b from-ghost_white to-burnt_sienna/20' onContextMenu={e => e.preventDefault()}>
            <div className='bg-burnt_sienna/80 hover:bg-burnt_sienna/90 py-1 cursor-pointer' onClick={handleToggleMyGroups}>
                <p className='sm:text-xl text-lg font-semibold text-center text-white'>My Groups</p>
            </div>

            <div className='flex justify-evenly shadow-md shadow-gray-950 bg-burnt_sienna/40 text-xs py-1'>
                <img src={filterIcon} alt='filter icon' className='h-6 ml-2' />
                <FilterButton filterName='Course' filterCriteria={state.filterCriteria.courseCodeToggle} onFilter={handleFilterToggle('courseCodeToggle')} />
                <FilterButton filterName='Curriculum' filterCriteria={state.filterCriteria.curriculumToggle} onFilter={handleFilterToggle('curriculumToggle')} />
                <FilterButton filterName='Type' filterCriteria={state.filterCriteria.typeToggle} onFilter={handleFilterToggle('typeToggle')} />
            </div>

            <div className={`overflow-y-auto flex flex-col transition-all ease-in-out duration-300 custom-scrollbar ${state.isMyGroupsOpen ? 'h-dvh' : 'h-0'}`}>
                {filteredProfCourses.map(course => (
                    <CourseGroups key={course.id} {...course} onContextMenuOpen={handleOpenCourseContextMenu} isContextMenuOpen={state.openContextMenuId === course.id} />
                ))}
            </div>
        </div >
    );
};