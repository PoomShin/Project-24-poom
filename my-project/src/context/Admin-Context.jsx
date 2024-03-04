import { createContext, useContext, useMemo } from 'react';
import { useQueryClient, useQuery, useMutation } from 'react-query';
import axios from 'axios';

const AdminContext = createContext();

export const useAdminContext = () => {
    return useContext(AdminContext);
};

const useFetchData = (url) => {
    const { data, error } = useQuery(url, async () => {
        const response = await axios.get(url);
        if (!response.data) throw new Error(`Failed to fetch data from ${url}`);
        return response.data;
    });
    return { data, error };
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
const useMutationWithQueryInvalidation = (mutationFunction, queryKey, onSuccessCallback, onErrorCallback) => {
    const queryClient = useQueryClient();

    const mutation = useMutation(mutationFunction, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(queryKey);
            if (onSuccessCallback) {
                onSuccessCallback(data);
            }
        },
        onError: (error) => {
            if (onErrorCallback) {
                onErrorCallback(error);
            }
        },
    });

    return mutation;
};

const useDelBranchMutation = () => {
    const mutationFunction = async (branch_tag) => {
        const response = await axios.delete(`/admin/delBranch/${branch_tag}`);
        return response.data;
    };

    return useMutationWithQueryInvalidation(
        mutationFunction,
        'branches',
        () => { },
        (error) => {
            throw new Error(error.response?.data.error || 'Failed to delete branch. Please try again later.');
        }
    );
};

const useAddBranchMutation = () => {
    const mutationFunction = async (branchData) => {
        const response = await axios.post('/admin/addBranch', branchData);
        return response.data;
    };

    return useMutationWithQueryInvalidation(
        mutationFunction,
        'branches',
        () => { },
        (error) => {
            throw new Error(error.response?.data.error || 'Failed to add branch. Please try again later.');
        }
    );
};

const useAddProfMutation = () => {
    const mutationFunction = async (formData) => {
        const response = await axios.post('/admin/addProf', formData);
        return response.data;
    };

    return useMutationWithQueryInvalidation(
        mutationFunction,
        'addProf',
        () => { },
        (error) => {
            throw new Error(error.response?.data.error || 'Unknown error');
        }
    );
};

const useUpdateProfMutation = (onSuccessCallback, onErrorCallback) => {
    const mutationFunction = async ({ id, name, email, role }) => {
        const response = await axios.put(`/admin/updateProf/${id}`, { name, email, role });
        return response.data;
    };

    return useMutationWithQueryInvalidation(mutationFunction, 'updateProf', onSuccessCallback, onErrorCallback);
};

const useDeleteProfMutation = (onSuccessCallback, onErrorCallback) => {
    const mutationFunction = async (id) => {
        const response = await axios.delete(`/admin/deleteProf/${id}`);
        return response.data;
    };

    return useMutationWithQueryInvalidation(mutationFunction, 'delProf', onSuccessCallback, onErrorCallback);
};

const useImportCourseMutation = (onSuccessCallback, onErrorCallback) => {
    const mutationFunction = async (data) => {
        const response = await axios.post('/admin/importCourse', { data });
        return response.data;
    };

    return useMutationWithQueryInvalidation(mutationFunction, null, onSuccessCallback, onErrorCallback);
};

export {
    AdminProvider,
    useDelBranchMutation,
    useAddBranchMutation,
    useAddProfMutation,
    useUpdateProfMutation,
    useDeleteProfMutation,
    useImportCourseMutation,
};