import { createContext, useContext, useMemo } from 'react';
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

    const contextValue = useMemo(() => ({
        branches,
        isLoading,
        isError
    }), [branches, isLoading, isError]);

    return (
        <BranchContext.Provider value={contextValue}>
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

    const contextValue = useMemo(() => ({
        courses,
        coursesLoading,
        coursesError
    }), [courses, coursesLoading, coursesError]);

    return (
        <CourseContext.Provider value={contextValue}>
            {children}
        </CourseContext.Provider>
    );
};
export const useCoursesContext = () => useContext(CourseContext);

// Professors with branch_tag context
const ProfsContext = createContext();
export const ProfsProvider = ({ branchTag, children }) => {
    const { data: profs, isLoading, isError } = useQuery(
        ['profsData', branchTag], // Providing branchTag as a query key
        async () => {
            try {
                const response = await axios.get(`/api/profs/${branchTag}`);
                return response.data;
            } catch (error) {
                throw new Error(`Failed to fetch professors: ${error.message}`);
            }
        }
    );

    const contextValue = useMemo(() => ({
        profs,
        isLoading,
        isError
    }), [profs, isLoading, isError]);

    return (
        <ProfsContext.Provider value={contextValue}>
            {children}
        </ProfsContext.Provider>
    );
};
export const useProfsContext = () => useContext(ProfsContext);