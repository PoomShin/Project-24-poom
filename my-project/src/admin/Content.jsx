const iconMap = {
    'Branch': branchIcon,
    'Prof': profIcon,
    'Curriculum': curriculumIcon,
    'Course': curriculumIcon
};
const buttonClass = `inline-block rounded-full bg-neutral-800 px-6 py-4 text-xs font-medium uppercase text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]`;

export default function Content({ currentPage, setCurrentPage }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBranchTag, setSelectedBranchTag] = useState();
    const [selectedCourseTag, setSelectedCourseTag] = useState();

    const { isLoading, isError, isSuccess, data: branches, error } = useFetchBranches();
    const { isLoading1, isError1, isSuccess1, data: profs, error1 } = useFetchProfessors(selectedBranchTag);
    const { isLoading2, isError2, isSuccess2, data: courses, error2 } = useFetchCourses(selectedBranchTag);

    const handleSelectBranch = useCallback((branchTag, courseTag) => {
        setCurrentPage(prevPage => prevPage === 'Branch' ? 'Prof' : 'Curriculum');
        setSelectedBranchTag(branchTag);
        setSelectedCourseTag(courseTag);
    }, [setCurrentPage]);

    const handleShowBranches = useCallback(() => {
        setCurrentPage(prevPage => prevPage === 'Curriculum' ? 'Course' : 'Branch');
        setSelectedBranchTag(null);
    }, [setCurrentPage]);

    const toggleModal = useCallback(() => {
        setIsModalOpen(prevState => !prevState);
    }, []);

    const icon = iconMap[currentPage];

    return (
        <div className="col-span-11 bg-gray-200">
            <div className="grid grid-cols-6 items-center bg-sky-200/75 border-b border-solid border-black p-4 mb-6">
                <div>
                    <img src={icon} className="inline h-12" />
                    <p className="inline text-3xl font-semibold ml-2">{currentPage}</p>
                </div>

                {/* Add Button */}
                <form className="col-start-7">
                    <button className={`${buttonClass} ${currentPage === 'Course' ? 'invisible' : ''}`}
                        type='button'
                        onClick={toggleModal}
                    >
                        Add {currentPage}
                    </button>
                </form>
            </div>

            {currentPage === 'Branch' && branches && (
                <>
                    <BranchItems branches={branches} onSelectBranch={handleSelectBranch} />
                    <AddBranchModal isVisible={isModalOpen} onClose={toggleModal} />
                </>
            )}
            {currentPage === 'Course' && branches && (
                <BranchItems branches={branches} onSelectBranch={handleSelectBranch} />
            )}
            {currentPage === 'Prof' && profs && (
                <>
                    <ProfItems profs={profs} onShowBranches={handleShowBranches} />
                    <AddProfModal branchTag={selectedBranchTag} isVisible={isModalOpen} onClose={toggleModal} />
                </>
            )}
            {currentPage === 'Curriculum' && courses && (
                <><CourseItems courses={courses} onShowBranches={handleShowBranches} />
                    <AddCourseModal courseTag={selectedCourseTag} branchTag={selectedBranchTag} isVisible={isModalOpen} onClose={toggleModal} />
                </>
            )}
        </div >
    );
}

import { useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

// Import components
import BranchItems from './Items/BranchItems';
import ProfItems from './Items/ProfItems';
import CourseItems from './Items/CourseItems';
import AddBranchModal from './Modals/AddBranchModal';
import AddProfModal from './Modals/AddProfModal';
import AddCourseModal from './Modals/AddCourseModal';

// Import assets
import branchIcon from '../assets/branch.png';
import curriculumIcon from '../assets/course.png';
import profIcon from '../assets/user.png';

//Custom hook for fetching branches
const useFetchBranches = () => {
    return useQuery('branches', async () => {
        const response = await fetch('http://localhost:5000/admin/branches');

        if (!response.ok) throw new Error('Failed to fetch branches');

        const data = await response.json();
        return data;
    });
};
// Custom hook for fetching professors
const useFetchProfessors = (selectedBranchTag) => {
    return useQuery(['professors', selectedBranchTag], async () => {
        const response = await fetch(`http://localhost:5000/admin/professors/${selectedBranchTag}`);
        if (!response.ok) {
            throw new Error('Failed to fetch professors');
        }
        const data = await response.json();
        return data;
    });
};
// Custom hook for fetching courses
const useFetchCourses = (selectedBranchTag) => {
    const fetchCourses = async () => {
        try {
            const response = await axios.get(`/admin/courses/${selectedBranchTag}`);
            return response.data;
        } catch (error) {
            throw new Error('Failed to fetch courses');
        }
    };

    return useQuery(['courses', selectedBranchTag], fetchCourses);
};