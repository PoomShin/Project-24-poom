import { useState, useCallback } from 'react';
import { useAdminContext } from '../../context/Admin-Context';
import TabBar from '../components/TabBar';
import BranchItems from '../Modules/BranchItems';
import ProfItems from '../Modules/ProfItems';
import CourseItems from '../Modules/CourseItems';
import AddBranchModal from '../Modals/AddBranchModal';
import AddProfModal from '../Modals/AddProfModal';
import AddCourseModal from '../Modals/AddCourseModal';

export default function Content({ currentPage, setCurrentPage, selectedBranchTag, setSelectedBranchTag }) {
    const { branches, profs, courses } = useAdminContext();

    const [courseTag, setCourseTag] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const modals = {
        Branch: { component: AddBranchModal, props: { isVisible: isModalOpen, onClose: toggleModal } },
        Prof: { component: AddProfModal, props: { branchTag: selectedBranchTag, isVisible: isModalOpen, onClose: toggleModal } },
        Curriculum: { component: AddCourseModal, props: { courseTag, branchTag: selectedBranchTag, isVisible: isModalOpen, onClose: toggleModal } }
    };

    const ModalComponent = modals[currentPage];

    return (
        <div className='col-span-11 bg-gray-200'>
            <TabBar currentPage={currentPage} toggleModal={toggleModal} />

            {(currentPage === 'Branch' || currentPage === 'Course') && branches && <BranchItems branches={branches} onSelectBranch={handleSelectBranch} />}
            {currentPage === 'Prof' && profs && <ProfItems profs={profs} onShowBranches={handleShowBranches} />}
            {currentPage === 'Curriculum' && courses && <CourseItems courses={courses} onShowBranches={handleShowBranches} />}

            {ModalComponent && <ModalComponent.component {...ModalComponent.props} />}
        </div>
    );
}