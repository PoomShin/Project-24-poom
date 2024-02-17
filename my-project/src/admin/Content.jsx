const iconMap = {
    'Branch': branchIcon,
    'Prof': profIcon,
    'Curriculum': curriculumIcon,
    'Course': curriculumIcon
};
const buttonClass = `inline-block rounded-full bg-neutral-800 px-6 py-4 text-xs font-medium uppercase text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]`;

export default function Content({ currentPage, setCurrentPage }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBranchTag, setSelectedBranchTag] = useState(null);
    const [selectedCourseTag, setSelectedCourseTag] = useState(null);
    const icon = iconMap[currentPage];

    const { data: branches, error: branchError } = useFetchData(`/admin/branches`);
    const { data: profs, error: profsError } = useFetchData(`/admin/professors/${selectedBranchTag}`);
    const { data: courses, error: coursesError } = useFetchData(`/admin/courses/${selectedBranchTag}`);

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

    return (
        <div className='col-span-11 bg-gray-200'>
            <TabBar icon={icon} currentPage={currentPage} toggleModal={toggleModal} />
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
                <>
                    <CourseItems courses={courses} onShowBranches={handleShowBranches} />
                    <AddCourseModal courseTag={selectedCourseTag} branchTag={selectedBranchTag} isVisible={isModalOpen} onClose={toggleModal} />
                </>
            )}
        </div >
    );
}

const TabBar = ({ icon, currentPage, toggleModal }) => {
    return (
        <div className='grid grid-cols-6 items-center bg-sky-200/75 border-b border-solid border-black p-4 mb-6'>
            <div>
                <img src={icon} className='inline h-12' />
                <p className='inline text-3xl font-semibold ml-2'>{currentPage}</p>
            </div>
            <form className='col-start-7'>
                <button className={`${buttonClass} ${currentPage === 'Course' ? 'invisible' : ''}`}
                    type='button'
                    onClick={toggleModal}
                >
                    Add {currentPage}
                </button>
            </form>
        </div>
    );
}

const useFetchData = (url) => {
    return useQuery(url, async () => {
        const response = await axios.get(url);
        if (!response.data) throw new Error(`Failed to fetch data from ${url}`);
        return response.data;
    });
};

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