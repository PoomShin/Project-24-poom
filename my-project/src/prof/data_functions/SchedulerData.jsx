import { generateTimeOptions } from "./functions";
import { generateTimeSlots } from "./functions";

export const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const Time_Options = generateTimeOptions();
export const Time_Slots = generateTimeSlots();

export const PRIORITY_VALUES = Object.freeze({
    'เฉพาะบังคับ': 5,
    'เฉพาะเลือก': 4,
    'เฉพาะทั่วไป': 3,
    'อื่นๆ': 2,
    'บริการ': 1,
});

export const Days_COLOR_MAP = {
    'Mon': 'bg-yellow-400',
    'Tue': 'bg-pink-400',
    'Wed': 'bg-green-400',
    'Thu': 'bg-orange-400',
    'Fri': 'bg-blue-400',
    'Sat': 'bg-purple-400',
    'Sun': 'bg-red-400',
};

export const COURSE_TYPE_COLOR_MAP = {
    'เฉพาะบังคับ': 'bg-red-300',
    'เฉพาะเลือก': 'bg-orange-400',
    'เฉพาะทั่วไป': 'bg-yellow-400',
    'อื่นๆ': 'bg-yellow-400',
    'บริการ': 'bg-green-400',
};

export const GRID_COL_DATA = {
    start: {
        8: 'col-start-3',
        8.5: 'col-start-4',
        9: 'col-start-5',
        9.5: 'col-start-6',
        10: 'col-start-7',
        10.5: 'col-start-8',
        11: 'col-start-9',
        11.5: 'col-start-10',
        12: 'col-start-11',
        12.5: 'col-start-12',
        13: 'col-start-13',
        13.5: 'col-start-14',
        14: 'col-start-15',
        14.5: 'col-start-16',
        15: 'col-start-17',
        15.5: 'col-start-18',
        16: 'col-start-19',
        16.5: 'col-start-20',
        17: 'col-start-21',
        17.5: 'col-start-22',
        18: 'col-start-23',
        18.5: 'col-start-24',
        19: 'col-start-25',
        19.5: 'col-start-26',
        20: 'col-start-27',
        20.5: 'col-start-28',
        21: 'col-start-29',
        21.5: 'col-start-30',
        22: 'col-start-31',
        22.5: 'col-start-32',
        23: 'col-start-33',
        23.5: 'col-start-34',
        24: 'col-start-35'
    },
    end: {
        8: 'col-end-3',
        8.5: 'col-end-4',
        9: 'col-end-5',
        9.5: 'col-end-6',
        10: 'col-end-7',
        10.5: 'col-end-8',
        11: 'col-end-9',
        11.5: 'col-end-10',
        12: 'col-end-11',
        12.5: 'col-end-12',
        13: 'col-end-13',
        13.5: 'col-end-14',
        14: 'col-end-15',
        14.5: 'col-end-16',
        15: 'col-end-17',
        15.5: 'col-end-18',
        16: 'col-end-19',
        16.5: 'col-end-20',
        17: 'col-end-21',
        17.5: 'col-end-22',
        18: 'col-end-23',
        18.5: 'col-end-24',
        19: 'col-end-25',
        19.5: 'col-end-26',
        20: 'col-end-27',
        20.5: 'col-end-28',
        21: 'col-end-29',
        21.5: 'col-end-30',
        22: 'col-end-31',
        22.5: 'col-end-32',
        23: 'col-end-33',
        23.5: 'col-end-34',
        24: 'col-end-35'
    }
};