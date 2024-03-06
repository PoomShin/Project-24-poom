import { createContext, useContext, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
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

    const generateBranchesWithYears = (branches) => {
        const branch_year = [];
        for (const branch of branches) {
            for (let i = 1; i <= 4; i++) {
                branch_year.push(`${branch.branch_tag}/${i}`);
            }
        }
        return branch_year;
    };
    const branch_year = useMemo(() => generateBranchesWithYears(branches || []), [branches]);

    const contextValue = useMemo(() => ({
        branches,
        branch_year,
        isLoading,
        isError
    }), [branches, isLoading, isError]);

    return (
        <BranchContext.Provider value={contextValue}>
            {children}
        </BranchContext.Provider>
    );
};

//courses table context
const CourseContext = createContext();
export const CourseProvider = ({ name, branch_tag, children }) => {
    const { data: courses, isLoading: coursesLoading, isError: coursesError } = useQuery(
        'courseData',
        async () => {
            const response = await axios.get(`/api/courses/${branch_tag}`);
            return response.data;
        }
    );

    const { data: profCourses, isLoading: profCoursesLoading, isError: profCoursesError } = useQuery(
        'profCoursesData',
        async () => {
            const response = await axios.get(`/profs/myCourse/${name}`);
            return response.data;
        }
    );

    const { data: allCourses, isLoading: allCoursesLoading, isError: allCoursesError } = useQuery(
        'allCoursesData',
        async () => {
            const response = await axios.get('/profs/allCourse/');
            return response.data;
        }
    );

    const contextValue = useMemo(() => ({
        courses,
        coursesLoading,
        coursesError,
        profCourses,
        profCoursesLoading,
        profCoursesError,
        allCourses,
        allCoursesLoading,
        allCoursesError
    }), [courses, coursesLoading, coursesError, profCourses, profCoursesLoading, profCoursesError, allCourses, allCoursesLoading, allCoursesError]);

    return (
        <CourseContext.Provider value={contextValue}>
            {children}
        </CourseContext.Provider>
    );
};

// Profs table with branch_tag parameter
const ProfsContext = createContext();
export const ProfsProvider = ({ branch_tag, children }) => {
    const { data: profsBranchTag, isprofsBranchTagLoading, isprofsBranchTagError } = useQuery(
        ['profsData', branch_tag],
        async () => {
            try {
                const response = await axios.get(`/api/profs/${branch_tag}`);
                return response.data;
            } catch (error) {
                throw new Error(`Failed to fetch professors: ${error.message}`);
            }
        }
    );

    const contextValue = useMemo(() => ({
        profsBranchTag,
        isprofsBranchTagLoading,
        isprofsBranchTagError
    }), [profsBranchTag, isprofsBranchTagLoading, isprofsBranchTagError]);

    return (
        <ProfsContext.Provider value={contextValue}>
            {children}
        </ProfsContext.Provider>
    );
};

//API Context
const useGroupsByBranchYear = (branchYear) => {
    const queryKey = ['groups', branchYear];

    if (branchYear === '') {
        return useQuery(queryKey, { data: [], isLoading: false, isError: false });
    }

    const fetchGroupsByBranchYear = async () => {
        try {
            const response = await axios.get(`/profs/groups/${encodeURIComponent(branchYear)}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error(`No groups found for the selected branch and year.`);
            } else {
                throw new Error(`Failed to fetch groups: ${error.message}`);
            }
        }
    };

    return useQuery(queryKey, fetchGroupsByBranchYear);
};

export const useBranchesContext = () => useContext(BranchContext);
export const useCoursesContext = () => useContext(CourseContext);
export const useProfsContext = () => useContext(ProfsContext);
export { useGroupsByBranchYear }
