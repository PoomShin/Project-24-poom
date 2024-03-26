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
            } else {
                throw new Error(error.response?.data.error || 'An error occurred');
            }
        },
    });

    return mutation;
};

const useMutationWithQueryInvalidationAndError = (mutationFunction, queryKey, onSuccessCallback, errorMessage) => {
    return useMutationWithQueryInvalidation(
        mutationFunction,
        queryKey,
        onSuccessCallback,
        () => {
            throw new Error(errorMessage);
        }
    );
};

//Admin API
export const useDelBranchMutation = () => {
    const mutationFunction = async (branch_tag) => {
        const response = await axios.delete(`/admin/delBranch/${branch_tag}`);
        return response.data;
    };

    return useMutationWithQueryInvalidationAndError(
        mutationFunction,
        'branches',
        () => { },
        'Failed to delete branch. Please try again later.'
    );
};

export const useAddBranchMutation = () => {
    const mutationFunction = async (branchData) => {
        const response = await axios.post('/admin/addBranch', branchData);
        return response.data;
    };

    return useMutationWithQueryInvalidationAndError(
        mutationFunction,
        'branches',
        () => { },
        'Failed to add branch. Please try again later.'
    );
};

export const useAddProfMutation = () => {
    const mutationFunction = async (formData) => {
        const response = await axios.post('/admin/addProf', formData);
        return response.data;
    };

    return useMutationWithQueryInvalidationAndError(
        mutationFunction,
        'addProf',
        () => { },
        'Failed to add professor. Please try again later.'
    );
};

export const useUpdateProfMutation = (onSuccessCallback) => {
    const mutationFunction = async ({ id, name, email, role }) => {
        const response = await axios.put(`/admin/updateProf/${id}`, { name, email, role });
        return response.data;
    };

    return useMutationWithQueryInvalidation(
        mutationFunction,
        'updateProf',
        onSuccessCallback,
        () => {
            throw new Error('Failed to update professor. Please try again later.');
        }
    );
};

export const useDeleteProfMutation = (onSuccessCallback) => {
    const mutationFunction = async (id) => {
        const response = await axios.delete(`/admin/deleteProf/${id}`);
        return response.data;
    };

    return useMutationWithQueryInvalidation(
        mutationFunction,
        'delProf',
        onSuccessCallback,
        () => {
            throw new Error('Failed to delete professor. Please try again later.');
        }
    );
};

export const useImportCourseMutation = () => {
    const mutationFunction = async (data) => {
        const response = await axios.post('/admin/importCourse', { data });
        return response.data;
    };

    return useMutationWithQueryInvalidationAndError(
        mutationFunction,
        null,
        () => { },
        'Failed to import course. Please try again later.'
    );
};

export const useDeleteCourseMutation = () => {
    const mutationFunction = async (courseId) => {
        const response = await axios.delete(`/admin/delCourse/${courseId}`);
        return response.data;
    };

    return useMutationWithQueryInvalidationAndError(
        mutationFunction,
        null,
        () => { },
        'Failed to delete course. Please try again later.'
    );
};

export const useUpdateCourseMutation = () => {
    const mutationFunction = async (courseData) => {
        const { id, ...updatedFields } = courseData;
        const response = await axios.put(`/admin/updateCourse/${id}`, updatedFields);
        return response.data;
    };

    return useMutationWithQueryInvalidationAndError(
        mutationFunction,
        null,
        () => { },
        'Failed to update course. Please try again later.'
    );
};
