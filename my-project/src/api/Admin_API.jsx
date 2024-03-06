import { useQueryClient, useMutation } from 'react-query';
import axios from 'axios';

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

const useDeleteCourseMutation = (onSuccessCallback, onErrorCallback) => {
    const mutationFunction = async (courseId) => {
        const response = await axios.delete(`/admin/delCourse/${courseId}`);
        return response.data;
    };

    return useMutationWithQueryInvalidation(
        mutationFunction,
        null,
        onSuccessCallback,
        onErrorCallback
    );
};

const useUpdateCourseMutation = (onSuccessCallback, onErrorCallback) => {
    const mutationFunction = async (courseData) => {
        const { id, ...updatedFields } = courseData; // Extracting course ID and other updated fields
        try {
            const response = await axios.put(`/admin/updateCourse/${id}`, updatedFields);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data.error || 'Failed to update course. Please try again later.');
        }
    };

    return useMutation(
        mutationFunction,
        {
            onSuccess: onSuccessCallback,
            onError: onErrorCallback
        }
    );
};


export {
    useDelBranchMutation,
    useAddBranchMutation,
    useAddProfMutation,
    useUpdateProfMutation,
    useDeleteProfMutation,
    useImportCourseMutation,
    useDeleteCourseMutation,
    useUpdateCourseMutation
};