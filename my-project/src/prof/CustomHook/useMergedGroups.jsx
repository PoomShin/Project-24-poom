import { useMemo } from 'react';

export function useMergedGroups(lectureGroups, labGroups) {
    const mergedGroups = useMemo(() => {
        return [...lectureGroups, ...labGroups];
    }, [lectureGroups, labGroups]);

    return mergedGroups;
}