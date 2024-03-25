import { useDelGroupById, useUpdateGroupById, useUpdateGroupStatusById, useDelCourseByName } from "../../api/Profs_API";
import { useCallback } from "react";

export const useGroupMutations = () => {
    const delGroupByIdMutation = useDelGroupById();
    const updateGroupByIdMutation = useUpdateGroupById();
    const updateGroupStatusByIdMutation = useUpdateGroupStatusById();

    const handleDeleteGroup = useCallback(async (groupId, onClose) => {
        try {
            await delGroupByIdMutation.mutateAsync(groupId);
            onClose();
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    }, [delGroupByIdMutation]);

    const handleUpdateGroup = useCallback(async (groupId, updatedGroupData, onClose) => {
        try {
            await updateGroupByIdMutation.mutateAsync({ groupId, groupData: updatedGroupData });
            onClose();
        } catch (error) {
            console.error('Error updating group:', error);
        }
    }, [updateGroupByIdMutation]);

    const handleGroupStatusChange = useCallback(async (groupId, newStatus) => {
        try {
            await updateGroupStatusByIdMutation.mutateAsync({ groupId, groupStatus: newStatus });
        } catch (error) {
            console.error(`Failed to update group status to ${newStatus}:`, error.message);
        }
    }, [updateGroupStatusByIdMutation]);

    return { handleDeleteGroup, handleUpdateGroup, handleGroupStatusChange };
};

export const useCourseMutations = () => {
    const { mutateAsync: delCourseByNameMutation } = useDelCourseByName();

    const handleDeleteCourse = useCallback(async (courseId, profName, onClose) => {
        try {
            await delCourseByNameMutation({ courseId, profName });
            onClose();
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    }, [delCourseByNameMutation]);

    return { handleDeleteCourse };
};