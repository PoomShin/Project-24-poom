import { createContext, useContext, useMemo } from 'react';
import { useQueryClient, useQuery, useMutation } from 'react-query'; // Import useQueryClient instead of queryClient
import axios from 'axios';

const AdminContext = createContext();

export const useAdminContext = () => {
    return useContext(AdminContext);
};

const useFetchData = (url) => {
    return useQuery(url, async () => {
        const response = await axios.get(url);
        if (!response.data) throw new Error(`Failed to fetch data from ${url}`);
        return response.data;
    });
};

const AdminProvider = ({ children, selectedBranchTag }) => {
    const value = useFetchValue(selectedBranchTag);

    return (
        <AdminContext.Provider value={value}>
            {children}
        </AdminContext.Provider>
    );
};

const useFetchValue = (branch_tag) => {
    const fetchBranches = useFetchData('/api/branches');
    const fetchProfs = useFetchData(`/api/profs/${branch_tag}`);
    const fetchCourses = useFetchData(`/api/courses/${branch_tag}`);

    return useMemo(() => ({
        branches: fetchBranches.data,
        branchError: fetchBranches.error,
        profs: fetchProfs.data,
        profsError: fetchProfs.error,
        courses: fetchCourses.data,
        coursesError: fetchCourses.error,
    }), [fetchBranches.data, fetchBranches.error, fetchProfs.data, fetchProfs.error, fetchCourses.data, fetchCourses.error]);
};

//Separate API Context
const delBranch = async (branch_tag) => {
    try {
        const response = await axios.delete(`/admin/delBranch/${branch_tag}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data.error || 'Failed to delete branch. Please try again later.');
    }
};
const useDelBranchMutation = () => {
    const queryClient = useQueryClient();
    return useMutation((branchTag) => delBranch(branchTag), {
        onSuccess: () => {
            queryClient.invalidateQueries('branches');
        },
    });
};

const addBranch = async (branchData) => {
    try {
        const response = await axios.post('/admin/addBranch', branchData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data.error || 'Failed to add branch. Please try again later.');
    }
};
const useAddBranchMutation = () => {
    const queryClient = useQueryClient();

    return useMutation((branchData) => addBranch(branchData), {
        onSuccess: () => {
            queryClient.invalidateQueries('branches');
        },
    });
};

const addProf = async (formData) => {
    try {
        const response = await axios.post('/admin/addProf', formData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data.error || 'Unknown error');
    }
};
const useAddProfMutation = () => {
    const queryClient = useQueryClient();

    return useMutation(addProf, {
        onSuccess: (data) => {
            if (data.success) {
                const { newProf } = data;
                alert('Professor added successfully', newProf);
            } else {
                alert(data.error || 'Unknown error');
            }
            queryClient.invalidateQueries('profs');
        },
        onError: (error) => {
            console.error(error.message);
            alert('An error occurred during submission');
        },
    });
};

const updateProf = async ({ id, name, email, role }) => {
    try {
        const response = await axios.put(`/admin/updateProf/${id}`, { name, email, role });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data.error || 'Unknown error');
    }
};
const useUpdateProfMutation = () => {
    return useMutation(updateProf, {
        onSuccess: (data) => {
            if (data.success) {
                alert(data.message);
            } else {
                alert(data.error || 'Unknown error');
            }
        },
        onError: (error) => {
            console.error(error.message);
            alert('An error occurred during update');
        },
    });
};

const deleteProf = async (id) => {
    try {
        const response = await axios.delete(`/admin/deleteProf/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data.error || 'Unknown error');
    }
};
const useDeleteProfMutation = () => {
    return useMutation(deleteProf, {
        onSuccess: (data) => {
            if (data.success) {
                alert(data.message);
            } else {
                alert(data.error || 'Unknown error');
            }
        },
        onError: (error) => {
            console.error(error.message);
            alert('An error occurred during delete');
        },
    });
};

const importCourse = async (data) => {
    try {
        const response = await axios.post('/admin/importCourse', { data });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data.error || 'Failed to import course data');
    }
};
const useImportCourseMutation = () => {
    return useMutation(importCourse, {
        onSuccess: () => {
            alert('Import to database success');
        },
        onError: (error) => {
            console.error(error.message);
            alert('An error occurred during course data import');
        },
    });
};

export { AdminProvider, useDelBranchMutation, useAddBranchMutation, useAddProfMutation, useUpdateProfMutation, useDeleteProfMutation, useImportCourseMutation };
