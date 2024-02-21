import { createContext, useContext, useMemo } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

const AdminContext = createContext();

export const useAdminContext = () => {
    return useContext(AdminContext);
};

export const AdminProvider = ({ children, selectedBranchTag }) => {
    const value = useFetchValue({ selectedBranchTag });
    return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

const useFetchValue = ({ selectedBranchTag }) => {
    const fetchBranches = useFetchData('/admin/branches');
    const fetchProfs = useFetchData(`/admin/professors/${selectedBranchTag}`);
    const fetchCourses = useFetchData(`/admin/courses/${selectedBranchTag}`);

    return useMemo(() => ({
        branches: fetchBranches.data,
        branchError: fetchBranches.error,
        profs: fetchProfs.data,
        profsError: fetchProfs.error,
        courses: fetchCourses.data,
        coursesError: fetchCourses.error,
    }), [fetchBranches.data, fetchBranches.error, fetchProfs.data, fetchProfs.error, fetchCourses.data, fetchCourses.error]);
};

const useFetchData = (url) => {
    return useQuery(url, async () => {
        const response = await axios.get(url);
        if (!response.data) throw new Error(`Failed to fetch data from ${url}`);
        return response.data;
    });
};
