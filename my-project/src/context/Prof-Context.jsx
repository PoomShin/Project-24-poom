import { createContext, useContext, useMemo } from 'react';
import { useGetAllBranches, useGetProfsByBranchTag, useGetAllCourses, useGetCoursesByBranchTag, useGetProfCoursesByName, useAllGroup } from '../api/Profs_API';

//branches table context
const BranchContext = createContext();
export const BranchProvider = ({ children }) => {
    const { data: branches, isLoading, isError } = useGetAllBranches(); // using useGetAllBranches hook to fetch branches

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
    const { data: courses, isLoading: coursesLoading, isError: coursesError } = useGetCoursesByBranchTag(branch_tag);
    const { data: profCourses, isLoading: profCoursesLoading, isError: profCoursesError } = useGetProfCoursesByName(name);
    const { data: allCourses, isLoading: allCoursesLoading, isError: allCoursesError } = useGetAllCourses();

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
    const { data: profsBranchTag, isLoading: isProfsBranchTagLoading, isError: isProfsBranchTagError } = useGetProfsByBranchTag(branch_tag);

    const contextValue = useMemo(() => ({
        profsBranchTag,
        isProfsBranchTagLoading,
        isProfsBranchTagError
    }), [profsBranchTag, isProfsBranchTagLoading, isProfsBranchTagError]);

    return (
        <ProfsContext.Provider value={contextValue}>
            {children}
        </ProfsContext.Provider>
    );
};

const GroupContext = createContext();
export const GroupProvider = ({ children }) => {
    const { data: allGroups, isLoading: allGroupsLoading, isError: allGroupsError, refetch: refetchAllGroups } = useAllGroup();

    const contextValue = useMemo(() => ({
        allGroups,
        allGroupsLoading,
        allGroupsError,
        refetchAllGroups
    }), [allGroups, allGroupsLoading, allGroupsError, refetchAllGroups]);

    return (
        <GroupContext.Provider value={contextValue}>
            {children}
        </GroupContext.Provider>
    );
};

export const useBranchesContext = () => useContext(BranchContext);
export const useCoursesContext = () => useContext(CourseContext);
export const useProfsContext = () => useContext(ProfsContext);
export const useGroupContext = () => useContext(GroupContext);
