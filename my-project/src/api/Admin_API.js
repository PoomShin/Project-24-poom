import { useQuery, useQueryClient, useMutation } from 'react-query';
import axios from 'axios';

const fetchData = async (url, key) => {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        throw new Error(`Failed to fetch ${key}: ${error.message}`);
    }
};

const useAdminApi = () => {
    const queryClient = useQueryClient();

    const getProfsByBranchTag = (branch_tag) => {
        return useQuery(['profsData', branch_tag], () => fetchData(`/api/profs/${branch_tag}`, 'professors'));
    };
    const getBranches = () => {
        return useQuery('branchesData', () => fetchData('/api/branches', 'branches'));
    };
    const getCoursesByBranchTag = (branch_tag) => {
        return useQuery(['coursesData', branch_tag], () => fetchData(`/api/courses/${branch_tag}`, 'courses'));
    };

    const useDelBranchMutation = () => {
        const delBranchMutation = async (branch_tag) => {
            const response = await axios.delete(`/admin/delBranch/${branch_tag}`);
            return response.data;
        };

        return useMutation(delBranchMutation, {
            onSuccess: () => {
                queryClient.invalidateQueries('branchesData');
            },
        });
    };
    const useAddBranchMutation = () => {
        const addBranchMutation = async (branchData) => {
            const response = await axios.post('/admin/addBranch', branchData);
            return response.data;
        };

        return useMutation(addBranchMutation, {
            onSuccess: () => {
                queryClient.invalidateQueries('branchesData');
            },
        });
    };

    const useAddProfMutation = () => {
        const addProfMutation = async (formData) => {
            const response = await axios.post('/admin/addProf', formData);
            return response.data;
        };

        return useMutation(addProfMutation, {
            onSuccess: () => {
                queryClient.invalidateQueries('profsData');
            },
        });
    };
    const useUpdateProfMutation = () => {
        const updateProfMutation = async ({ id, name, email, role }) => {
            const response = await axios.put(`/admin/updateProf/${id}`, { name, email, role });
            return response.data;
        };

        return useMutation(updateProfMutation, {
            onSuccess: () => {
                queryClient.invalidateQueries('profsData');
            },
        });
    };
    const useDeleteProfMutation = () => {
        const deleteProfMutation = async (id) => {
            const response = await axios.delete(`/admin/deleteProf/${id}`);
            return response.data;
        };

        return useMutation(deleteProfMutation, {
            onSuccess: () => {
                queryClient.invalidateQueries('profsData');
            },
        });
    };

    const useImportCourseMutation = () => {
        const importCourseMutation = async (data) => {
            const response = await axios.post('/admin/importCourse', { data });
            return response.data;
        };

        return useMutation(importCourseMutation, {
            onSuccess: () => {
                queryClient.invalidateQueries('coursesData');
            },
        });
    };
    const useDeleteCourseMutation = () => {
        const deleteCourseMutation = async (courseId) => {
            const response = await axios.delete(`/admin/delCourse/${courseId}`);
            return response.data;
        };

        return useMutation(deleteCourseMutation, {
            onSuccess: () => {
                queryClient.invalidateQueries('coursesData');
            },
        });
    };
    const useUpdateCourseMutation = () => {
        const updateCourseMutation = async (courseData) => {
            const { id, ...updatedFields } = courseData;
            const response = await axios.put(`/admin/updateCourse/${id}`, updatedFields);
            return response.data;
        };

        return useMutation(updateCourseMutation, {
            onSuccess: () => {
                queryClient.invalidateQueries('coursesData');
            },
        });
    };
    const useDeleteCoursesByBranchMutation = () => {
        const deleteCoursesByBranchMutation = async (branch_tag) => {
            const response = await axios.delete(`/admin/delCoursesByBranch/${branch_tag}`);
            return response.data;
        };

        return useMutation(deleteCoursesByBranchMutation, {
            onSuccess: () => {
                queryClient.invalidateQueries('coursesData');
            },
        });
    };

    return {
        getProfsByBranchTag,
        getBranches,
        getCoursesByBranchTag,
        useDelBranchMutation,
        useAddBranchMutation,
        useAddProfMutation,
        useUpdateProfMutation,
        useDeleteProfMutation,
        useImportCourseMutation,
        useDeleteCourseMutation,
        useUpdateCourseMutation,
        useDeleteCoursesByBranchMutation
    };
};

export default useAdminApi;