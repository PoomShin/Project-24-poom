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
export const CourseProvider = ({ branch_tag, children }) => {
    const { data: courses, isLoading: coursesLoading, isError: coursesError } = useQuery(
        'courseData',
        async () => {
            const response = await axios.get(`/api/courses/${branch_tag}`);
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

// Profs table with branch_tag parameter
const ProfsContext = createContext();
export const ProfsProvider = ({ branch_tag, children }) => {
    const { data: profs, isLoading, isError } = useQuery(
        ['profsData', branch_tag], // Providing branchTag as a query key
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

//API Context
const addGroup = async (groupData) => {
    try {
        const response = await axios.post('/api/addGroups', groupData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data.error || 'Failed to add group. Please try again later.');
    }
};
const useAddGroupMutation = () => {
    const queryClient = useQueryClient();

    return useMutation((groupData) => addGroup(groupData), {
        onSuccess: () => {
            queryClient.invalidateQueries('groups');
        },
    });
};

export const useBranchesContext = () => useContext(BranchContext);
export const useCoursesContext = () => useContext(CourseContext);
export const useProfsContext = () => useContext(ProfsContext);
export { useAddGroupMutation }
