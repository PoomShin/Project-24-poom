import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';

//API Context
const useGroupsByBranchYear = (branchYear) => {
    const queryKey = ['groups', branchYear];

    if (branchYear === '') {
        return useQuery(queryKey, { data: [], isLoading: false, isError: false });
    }

    const fetchGroupsByBranchYear = async () => {
        try {
            const response = await axios.get(`/profs/groups/${encodeURIComponent(branchYear)}`);
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                throw new Error(`No groups found for the selected branch and year.`);
            } else {
                throw new Error(`Failed to fetch groups: ${error.message}`);
            }
        }
    };

    return useQuery(queryKey, fetchGroupsByBranchYear);
};

const useAddGroupMutation = () => {
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
            queryClient.invalidateQueries('groups');
        },
    });
};

export { useAddGroupMutation, useGroupsByBranchYear }