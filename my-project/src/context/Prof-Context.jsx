import { createContext, useContext } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

//branches table context
const BranchContext = createContext();

export const BranchProvider = ({ children }) => {
    const { data: branches, isLoading, isError } = useQuery(
        'branchTags',
        async () => {
            const response = await axios.get('/api/branches');
            return response.data;
        }
    );

    return (
        <BranchContext.Provider value={{ branches }}>
            {children}
        </BranchContext.Provider>
    );
};
export const useBranchesContext = () => useContext(BranchContext);

//courses table context
const CourseContext = createContext();

export const CourseProvider = ({ branchtag, children }) => {
    const { data: courses, isLoading: coursesLoading, isError: coursesError } = useQuery(
        'courseData',
        async () => {
            const response = await axios.get(`/api/courses/${branchtag}`);
            return response.data;
        }
    );

    return (
        <CourseContext.Provider value={{ courses }}>
            {children}
        </CourseContext.Provider>
    );
};
export const useCoursesContext = () => useContext(CourseContext);