import { useState, useCallback, useMemo } from 'react';
import { useAdminContext } from '../../context/Admin-Context';
//components
import TabBar from '../components/TabBar';
import BranchItems from '../Modules/BranchItems';
import ProfItems from '../Modules/ProfItems';
import CourseItems from '../Modules/CourseItems';
//API
import AddBranchModal from '../Modals/AddBranchModal';
import AddProfModal from '../Modals/AddProfModal';
import AddCourseModal from '../Modals/AddCourseModal';
//assets
import branchIcon from '../../assets/branch.png';
import curriculumIcon from '../../assets/course.png';
import profIcon from '../../assets/user.png';

const iconMap = {
    'Branch': branchIcon,
    'Prof': profIcon,
    'Curriculum': curriculumIcon,
    'Course': curriculumIcon
};

export default function Content({ currentPage, setCurrentPage, selectedBranchTag, setSelectedBranchTag }) {
    const [courseTag, setCourseTag] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { branches, profs, courses } = useAdminContext();
    const icon = useMemo(() => iconMap[currentPage], [currentPage]);

    const handleSelectBranch = useCallback((branchTag, courseTag) => {
        setCurrentPage(prevPage => prevPage === 'Branch' ? 'Prof' : 'Curriculum');
        setSelectedBranchTag(branchTag);
        setCourseTag(courseTag);
    }, [setCurrentPage, setSelectedBranchTag, setCourseTag]);

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
                    <BranchItems branches={branches} onSelectBranch={handleSelectBranch} setCurrentPage={setCurrentPage} />
                    <AddBranchModal isVisible={isModalOpen} onClose={toggleModal} />
                </>
            )}
            {currentPage === 'Course' && branches && (
                <BranchItems branches={branches} onSelectBranch={handleSelectBranch} />
            )}
            {currentPage === 'Prof' && profs && (
                <>
                    <AddProfModal branchTag={selectedBranchTag} isVisible={isModalOpen} onClose={toggleModal} />
                    <ProfItems profs={profs} onShowBranches={handleShowBranches} />
                </>
            )}
            {currentPage === 'Curriculum' && courses && (
                <>
                    <CourseItems courses={courses} onShowBranches={handleShowBranches} />
                    <AddCourseModal courseTag={courseTag} branchTag={selectedBranchTag} isVisible={isModalOpen} onClose={toggleModal} />
                </>
            )}
        </div>
    );
}
