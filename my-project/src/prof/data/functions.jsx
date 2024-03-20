export const parseCredits = credits => {
    const matches = credits.match(/(\d+)\((\d+)-(\d+)-(\d+)\)|(\d+)/);
    if (matches) {
        const [, totalHours, lectureHours, labHours, selfStudyHours, singleCredit] = matches;
        if (lectureHours && labHours && selfStudyHours) {
            return { lectureHours: parseInt(lectureHours), labHours: parseInt(labHours), selfStudyHours: parseInt(selfStudyHours) };
        } else if (totalHours) {
            return { lectureHours: parseInt(totalHours), labHours: 0, selfStudyHours: 0 };
        } else if (singleCredit) {
            return { lectureHours: parseInt(singleCredit), labHours: 0, selfStudyHours: 0 };
        }
    }
    return { lectureHours: 0, labHours: 0, selfStudyHours: 0 };
};

export const simplifyTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
}

export const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 24; hour++) {
        const formattedHour = hour < 10 ? `0${hour}` : hour;
        for (let minute = 0; minute < 60; minute += 30) {
            if (hour === 24 && minute > 0) {
                break;
            }
            const formattedMinute = minute === 0 ? '00' : minute;
            options.push(`${formattedHour}:${formattedMinute}`);
        }
    }
    return options;
};

export const generateTimeSlots = () => {
    const timeSlots = [];
    for (let hour = 8; hour < 24; hour++) {
        const formattedHour = hour.toString().padStart(2, '0');
        timeSlots.push(`${formattedHour}:00`);
    }
    return timeSlots;
};

export const calculateOverlappingCount = (filteredGroupsStatus) => {
    let overlappingCount = 0;

    const groupedByDay = filteredGroupsStatus.reduce((acc, group) => {
        acc[group.day_of_week] = acc[group.day_of_week] || [];
        acc[group.day_of_week].push(group);
        return acc;
    }, {});

    Object.values(groupedByDay).forEach(groups => {
        groups.sort((a, b) => {
            const getTime = time => {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            };

            return getTime(a.start_time) - getTime(b.start_time);
        });

        for (let i = 0; i < groups.length - 1; i++) {
            const { start_time: startTimeGroup1, end_time: endTimeGroup1 } = groups[i];
            const { start_time: startTimeGroup2, end_time: endTimeGroup2 } = groups[i + 1];

            const getTime = time => {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            };

            const start1 = getTime(startTimeGroup1);
            const end1 = getTime(endTimeGroup1);
            const start2 = getTime(startTimeGroup2);
            const end2 = getTime(endTimeGroup2);

            if (start1 < end2 && end1 > start2) {
                overlappingCount++;
            }
        }
    });

    return overlappingCount;
};

export const getStatusCounts = (allGroupsStatus) => {
    const statusCounts = {
        waiting: 0,
        accept: 0,
        reject: 0
    };

    if (allGroupsStatus) {
        allGroupsStatus.forEach(group => {
            statusCounts[group.group_status]++;
        });
    }

    return statusCounts;
};