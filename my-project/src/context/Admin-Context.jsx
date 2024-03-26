import { createContext, useContext, useMemo } from 'react';
import useAdminApi from '../api/Admin_API';

const AdminContext = createContext();

export const useAdminContext = () => {
    return useContext(AdminContext);
};

export const AdminProvider = ({ children, selectedBranchTag }) => {
    const { getBranches, getCoursesByBranchTag, getProfsByBranchTag } = useAdminApi();
    const { data: branches } = getBranches();
    const { data: profs } = getProfsByBranchTag(selectedBranchTag);
    const { data: courses } = getCoursesByBranchTag(selectedBranchTag);

    const value = useMemo(() => ({
        branches,
        profs,
        courses
    }), [branches, profs, courses]);

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};