import { createContext, useContext, useMemo } from 'react';
import { getAllBranches, getProfsByBranchTag, getAllCourses, getCoursesByBranchTag, getCoursesByProf, getGroupsByBranch } from '../api/Profs_API';

//branches table context
const BranchContext = createContext();
export const BranchProvider = ({ children }) => {
    const { data: branches } = getAllBranches();

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
    }), [branches, branch_year]);

    return (
        <BranchContext.Provider value={contextValue}>
            {children}
        </BranchContext.Provider>
    );
};

//courses table context
const CourseContext = createContext();
export const CourseProvider = ({ branch_tag, name, children }) => {
    const { data: courses } = getCoursesByBranchTag(branch_tag);
    const { data: profCourses, refetch: refetchProfCourses } = getCoursesByProf(name);
    const { data: allCourses } = getAllCourses();

    const contextValue = useMemo(() => ({
        courses,
        profCourses,
        refetchProfCourses,
        allCourses,
    }), [courses, profCourses, refetchProfCourses, allCourses]);

    return (
        <CourseContext.Provider value={contextValue}>
            {children}
        </CourseContext.Provider>
    );
};

// Profs table with branch_tag parameter
const ProfsContext = createContext();
export const ProfsProvider = ({ branch_tag, children }) => {
    const { data: profsBranchTag } = getProfsByBranchTag(branch_tag);

    const contextValue = useMemo(() => ({
        profsBranchTag,
    }), [profsBranchTag]);

    return (
        <ProfsContext.Provider value={contextValue}>
            {children}
        </ProfsContext.Provider>
    );
};

const GroupContext = createContext();
export const GroupProvider = ({ children, ownerBranch }) => {
    const { data: groupsByBranch, refetch: refetchGroupsByBranch } = getGroupsByBranch(ownerBranch);

    const contextValue = useMemo(() => ({
        groupsByBranch,
        refetchGroupsByBranch
    }), [groupsByBranch, refetchGroupsByBranch]);

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
