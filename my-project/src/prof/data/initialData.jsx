export const initialCreditHour = { lectureHours: 0, labHours: 0, selfStudyHours: 0 };

export const initialCourseInfoState = {
    selectedCourse: '',
    id: null,
    th_name: '',
    eng_name: '',
    credit: '',
    course_type: '',
};
export const sideBarRightInitialState = {
    openContextMenuId: null,
    isMyGroupsOpen: true,
    sortType: null,
    filterCriteria: {
        courseCodeToggle: 'min',
        curriculumToggle: 'min',
        typeToggle: 'min',
    }
};