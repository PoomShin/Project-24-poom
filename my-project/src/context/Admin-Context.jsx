import { createContext, useContext, useMemo } from 'react';
import useAdminApi from '../api/Admin_API';

const AdminContext = createContext();

export const useAdminContext = () => {
    return useContext(AdminContext);
};

export const AdminProvider = ({ children, selectedBranchTag }) => {
    const { getBranches, getCoursesByBranchTag, getProfsByBranchTag } = useAdminApi();
    const { data: branches, error: branchError, refetch: refetchBranches } = getBranches();
    const { data: profs, error: profsError, refetch: refetchProfs } = getProfsByBranchTag(selectedBranchTag);
    const { data: courses, error: coursesError, refetch: refetchCourses } = getCoursesByBranchTag(selectedBranchTag);

    const value = useMemo(() => ({
        branches,
        branchError,
        profs,
        profsError,
        courses,
        coursesError,
        refetchBranches, // Expose the refetch function for branches
        refetchProfs, // Expose the refetch function for profs
        refetchCourses, // Expose the refetch function for courses
    }), [branches, branchError, profs, profsError, courses, coursesError, refetchBranches, refetchProfs, refetchCourses]);

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};