import { useState, useCallback } from 'react';

export default function ContentProf({ currentPage, userData }) {
    const { id, name, email, role, branch_tag } = userData;

    const [branch, setBranch] = useState(branch_tag);
    const [branchYear, setBranchYear] = useState('');
    const [prof, setProf] = useState(name);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleYearChange = selectedBranchYear => {
        setBranchYear(selectedBranchYear)
    }
    const handleBranchChange = selectedBranch => {
        setBranch(selectedBranch)
    }
    const handleProfChange = selectedProf => {
        setProf(selectedProf)
    }

    const toggleModal = useCallback(() => {
        setIsModalOpen(prevState => !prevState);
    }, []);

    return (
        <div className='col-span-8 bg-gray-200'>
            <ContentProfHeader currentPage={currentPage}>
                <HeaderContent currentPage={currentPage}
                    currentBranch={branch} handleBranchChange={handleBranchChange}
                    currentYear={branchYear} handleYearChange={handleYearChange}
                    currentProf={prof} handleProfChange={handleProfChange}
                />
            </ContentProfHeader>

            <Scheduler currentPage={currentPage} branchYear={branchYear} currentProf={prof} />

            {currentPage === 'Home' && (
                <>
                    <InsertCourseModal ownerBranchTag={branch_tag} isVisible={isModalOpen} onClose={toggleModal} />
                    <ButtonCom style='rounded bg-blue-500 hover:bg-blue-700 text-white font-bold mb-4 py-2 px-4'
                        text='Add Course' type='button' onClick={toggleModal}
                    />
                </>
            )}
        </div>
    );
}

import ContentProfHeader from '../components/ContentProfHeader';
import HeaderContent from '../components/HeaderContent';
import Scheduler from '../modules/Scheduler';
import InsertCourseModal from '../modules/InsertCourseModal';
import ButtonCom from '../components/ButtonCom';