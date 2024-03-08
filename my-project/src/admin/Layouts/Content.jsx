import { useState, useCallback, useMemo } from 'react';
import { useAdminContext } from '../../context/Admin-Context';
//components
import TabBar from '../components/TabBar';
import BranchItems from '../Modules/BranchItems';
import ProfItems from '../Modules/ProfItems';
import CourseItems from '../Modules/CourseItems';
//Modals
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
    const { branches, refetchBranches, profs, refetchProfs, courses, refetchCourses } = useAdminContext();

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

    const icon = useMemo(() => iconMap[currentPage], [currentPage]);
    const modals = {
        Branch: { component: AddBranchModal, props: { isVisible: isModalOpen, onClose: toggleModal, refetchBranches: refetchBranches } },
        Prof: { component: AddProfModal, props: { branchTag: selectedBranchTag, isVisible: isModalOpen, onClose: toggleModal, refetchProfs: refetchProfs } },
        Curriculum: { component: AddCourseModal, props: { courseTag: courseTag, branchTag: selectedBranchTag, isVisible: isModalOpen, onClose: toggleModal } }
    };
    const ModalComponent = modals[currentPage];

    return (
        <div className='col-span-11 bg-gray-200'>
            <TabBar icon={icon} currentPage={currentPage} toggleModal={toggleModal} />

            {(currentPage === 'Branch' || currentPage === 'Course') && branches && (
                <BranchItems branches={branches} onSelectBranch={handleSelectBranch} refetchBranches={refetchBranches} />)}
            {currentPage === 'Prof' && profs && (
                <ProfItems profs={profs} onShowBranches={handleShowBranches} refetchProfs={refetchProfs} />
            )}
            {currentPage === 'Curriculum' && courses && (
                <CourseItems courses={courses} onShowBranches={handleShowBranches} refetchCourses={refetchCourses} />
            )}

            {ModalComponent && <ModalComponent.component {...ModalComponent.props} />}
        </div>
    );
}
