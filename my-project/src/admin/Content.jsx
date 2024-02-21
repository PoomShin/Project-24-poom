import { useState, useCallback, useMemo } from 'react';
import { useAdminContext } from '../context/Admin-Context';

const iconMap = {
    'Branch': branchIcon,
    'Prof': profIcon,
    'Curriculum': curriculumIcon,
    'Course': curriculumIcon
};

export default function Content({ currentPage, setCurrentPage, selectedBranchTag, setSelectedBranchTag }) {
    const { branches, profs, courses, branchError, profsError, coursesError } = useAdminContext();
    const [selectedCourseTag, setSelectedCourseTag] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const icon = useMemo(() => iconMap[currentPage], [currentPage]); //prevent unnecessary re-renders

    const handleSelectBranch = useCallback((branchTag, courseTag) => {
        setCurrentPage(prevPage => prevPage === 'Branch' ? 'Prof' : 'Curriculum');
        setSelectedBranchTag(branchTag);
        setSelectedCourseTag(courseTag);
    }, [setCurrentPage, setSelectedBranchTag, setSelectedCourseTag]);

    const handleShowBranches = useCallback(() => {
        setCurrentPage(prevPage => prevPage === 'Curriculum' ? 'Course' : 'Branch');
        setSelectedBranchTag(null);
    }, [setCurrentPage, setSelectedBranchTag]);

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
        </div>
    );
}

// Import components
import BranchItems from './Items/BranchItems';
import ProfItems from './Items/ProfItems';
import CourseItems from './Items/CourseItems';
import AddBranchModal from './Modals/AddBranchModal';
import AddProfModal from './Modals/AddProfModal';
import AddCourseModal from './Modals/AddCourseModal';
import TabBar from './components/TabBar';

// Import assets
import branchIcon from '../assets/branch.png';
import curriculumIcon from '../assets/course.png';
import profIcon from '../assets/user.png';