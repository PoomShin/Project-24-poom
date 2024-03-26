import { IconData } from "./iconData";

export const sidebarItems = [
    { key: 'Branch', label: 'Branch', icon: IconData['BranchIcon'] },
    { key: 'Course', label: 'Course', icon: IconData['CourseIcon'] },
    { key: 'Logout', label: 'Log out', icon: IconData['LogoutIcon'] },
];

export const contentIconMap = {
    'Branch': IconData['BranchIcon'],
    'Prof': IconData['ProfIcon'],
    'Curriculum': IconData['CurriculumIcon'],
    'Course': IconData['CurriculumIcon']
};