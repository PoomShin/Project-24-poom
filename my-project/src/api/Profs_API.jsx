import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

//get branches API
export const getAllBranches = () => {
    const fetchBranches = async () => {
        try {
            const response = await axios.get('/api/branches');
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch branches: ${error.message}`);
            throw new Error('Failed to fetch branches. Please try again later.');
        }
    };

    return useQuery('branchTags', fetchBranches);
};
//get profs API
export const getProfsByBranchTag = (branch_tag) => {
    return useQuery(
        ['profsData', branch_tag],
        async () => {
            try {
                const response = await axios.get(`/api/profs/${branch_tag}`);
                return response.data;
            } catch (error) {
                throw new Error(`Failed to fetch professors: ${error.message}`);
            }
        }
    );
};
//get courses API
export const getCoursesByBranchTag = (branch_tag) => {
    return useQuery(
        'courseData',
        async () => {
            const response = await axios.get(`/api/courses/${branch_tag}`);
            return response.data;
        }
    );
};

export const getCoursesByProf = (name) => {
    return useQuery(
        'CoursesByProf',
        async () => {
            const response = await axios.get(`/profs/myCourse/${name}`);
            return response.data;
        }
    );
};

export const getAllCourses = () => {
    return useQuery(
        'allCoursesData',
        async () => {
            const response = await axios.get('/profs/allCourse/');
            return response.data;
        }
    );
};
//get groups API
export const getGroupsByBranch = (branch) => {
    return useQuery(
        ['groupsByBranch', branch],
        async () => {
            const response = await axios.get(`/profs/groupsB/${branch}`);
            return response.data;
        }
    );
};
export const useGroupsByBranchYear = (branchYear) => {
    const queryKey = ['groups', branchYear];

    const fetchGroupsByBranchYear = async () => {
        try {
            const response = await axios.get(`/profs/groupsBY/${encodeURIComponent(branchYear)}`);
            const data = response.data.map(group => ({
                ...group,
                prof_names: group.prof_names || [] // Ensure prof_names is an array even if it's null
            }));
            return data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.error(`No groups found for the selected branch and year.`);
            } else {
                console.error(`Failed to fetch groups: ${error.message}`);
            }
        }
    };

    return useQuery(queryKey, fetchGroupsByBranchYear);
};
export const useAllGroupsByBranch = (branch) => {
    return useQuery(
        ['allGroupsByBranch', branch],
        async () => {
            try {
                const response = await axios.get(`/profs/allGroups/${branch}`);
                return response.data;
            } catch (error) {
                throw new Error(`Failed to fetch groups by branch: ${error.message}`);
            }
        }
    );
};
export const useGetLabRoomByBranch = (branch) => {
    return useQuery(
        ['labRooms', branch],
        async () => {
            try {
                const response = await axios.get(`/profs/labRoom/${branch}`);
                return response.data;
            } catch (error) {
                throw new Error(`Failed to fetch lab rooms: ${error.message}`);
            }
        }
    );
};
export const getGroupsStatusByBranch = (branch) => {
    return useQuery(
        ['groupsStatus', branch],
        async () => {
            const response = await axios.get(`/profs/groupsStatus/${branch}`);
            return response.data;
        }
    );
};
//groups other API
export const useAddGroupMutation = () => {
    const queryClient = useQueryClient();

    const addGroup = async (groupData) => {
        try {
            const response = await axios.post('/profs/addGroups', groupData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data.error || 'Failed to add group. Please try again later.');
        }
    };

    return useMutation((groupData) => addGroup(groupData), {
        onSuccess: () => {
            queryClient.invalidateQueries('CoursesByProf');
            queryClient.invalidateQueries('groups');
            queryClient.invalidateQueries('groupsStatus');
            queryClient.invalidateQueries('allGroupsByBranch');
            queryClient.invalidateQueries('labRooms');
            queryClient.invalidateQueries('exportDataByBranch');
            queryClient.invalidateQueries('groupsByBranch');
        },
    });
};
export const useDelCourseByName = () => {
    const queryClient = useQueryClient();

    const delCourseByNameMutation = async ({ courseId, profName }) => {
        try {
            const response = await axios.delete(`/profs/delCourse/${courseId}/${profName}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data.error || 'Failed to delete course. Please try again later.');
        }
    };

    return useMutation(delCourseByNameMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('CoursesByProf');
            queryClient.invalidateQueries('groups');
            queryClient.invalidateQueries('groupsStatus');
            queryClient.invalidateQueries('allGroupsByBranch');
            queryClient.invalidateQueries('labRooms');
            queryClient.invalidateQueries('exportDataByBranch');
            queryClient.invalidateQueries('groupsByBranch');
        },
    });
};
export const useDelGroupById = () => {
    const queryClient = useQueryClient();

    const delGroupByIdMutation = async (groupId) => {
        try {
            const response = await axios.delete(`/profs/delGroup/${groupId}`);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data.error || 'Failed to delete group. Please try again later.');
        }
    };

    return useMutation(delGroupByIdMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('groups');
            queryClient.invalidateQueries('groupsStatus');
            queryClient.invalidateQueries('allGroupsByBranch');
            queryClient.invalidateQueries('CoursesByProf');
            queryClient.invalidateQueries('labRooms');
            queryClient.invalidateQueries('exportDataByBranch');
            queryClient.invalidateQueries('groupsByBranch');
        },
    });
};
export const useUpdateGroupById = () => {
    const queryClient = useQueryClient();

    const updateGroupByIdMutation = async ({ groupId, groupData }) => {
        try {
            const response = await axios.put(`/profs/updateGroup/${groupId}`, { groupData });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data.error || 'Failed to update group. Please try again later.');
        }
    };

    return useMutation(updateGroupByIdMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('groups');
            queryClient.invalidateQueries('groupsStatus');
            queryClient.invalidateQueries('allGroupsByBranch');
            queryClient.invalidateQueries('CoursesByProf');
            queryClient.invalidateQueries('labRooms');
            queryClient.invalidateQueries('exportDataByBranch');
            queryClient.invalidateQueries('groupsByBranch');
        },
    });
};
export const useUpdateGroupStatusById = () => {
    const queryClient = useQueryClient();

    const updateGroupStatusByIdMutation = async ({ groupId, groupStatus }) => {
        try {
            const response = await axios.put(`/profs/updateGroupStatus/${groupId}`, { groupStatus });
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data.error || 'Failed to update group status. Please try again later.');
        }
    };

    return useMutation(updateGroupStatusByIdMutation, {
        onSuccess: () => {
            queryClient.invalidateQueries('groups');
            queryClient.invalidateQueries('groupsStatus');
            queryClient.invalidateQueries('allGroupsByBranch');
            queryClient.invalidateQueries('CoursesByProf');
            queryClient.invalidateQueries('labRooms');
            queryClient.invalidateQueries('exportDataByBranch');
            queryClient.invalidateQueries('groupsByBranch');
        },
    });
};

//Export Groups API
export const getExportDataByBranch = (branch) => {
    return useQuery(
        ['exportDataByBranch', branch],
        async () => {
            try {
                const response = await axios.get(`/profs/exportMyBranch/${branch}`);
                return response.data;
            } catch (error) {
                throw new Error(`Failed to fetch export data: ${error.message}`);
            }
        }
    );
};