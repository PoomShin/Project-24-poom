import { IconData } from "./iconData";
import { generateOptions } from "./generalFunctions";

export const options = generateOptions();
export const currentYear = (new Date().getFullYear() + 543) % 100;
export const courseTypes = ['เฉพาะทั่วไป', 'เฉพาะเลือก', 'เฉพาะบังคับ', 'บริการ', 'อื่นๆ'];

export const sidebarItems = [
    { key: 'Branch', label: 'Branch', icon: IconData['BranchIcon'] },
    { key: 'Course', label: 'Course', icon: IconData['CourseIcon'] },
    { key: 'Logout', label: 'Log out', icon: IconData['LogoutIcon'] },
];

export const tabbarIconMap = {
    'Branch': IconData['BranchIcon'],
    'Prof': IconData['ProfIcon'],
    'Curriculum': IconData['CurriculumIcon'],
    'Course': IconData['CurriculumIcon']
};