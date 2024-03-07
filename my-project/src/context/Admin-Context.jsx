import { createContext, useContext, useMemo } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

const AdminContext = createContext();

export const useAdminContext = () => {
    return useContext(AdminContext);
};

const useFetchData = (url) => {
    const { data, error, refetch } = useQuery(url, async () => {
        const response = await axios.get(url);
        if (!response.data) throw new Error(`Failed to fetch data from ${url}`);
        return response.data;
    });
    return { data, error, refetch };
};

export const AdminProvider = ({ children, selectedBranchTag }) => {
    const { data: branches, error: branchError, refetch: refetchBranches } = useFetchData('/api/branches');
    const { data: profs, error: profsError, refetch: refetchProfs } = useFetchData(`/api/profs/${selectedBranchTag}`);
    const { data: courses, error: coursesError, refetch: refetchCourses } = useFetchData(`/api/courses/${selectedBranchTag}`);

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