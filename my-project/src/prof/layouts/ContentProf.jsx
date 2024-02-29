import { useState, useCallback } from 'react';
import { useBranchesContext } from '../../context/Prof-Context';

export default function ContentProf({ currentPage, userData }) {
    const { branches } = useBranchesContext();
    const { id, name, email, role, branch_tag } = userData;

    const [branch, setBranch] = useState(branch_tag);
    const [branchYear, setBranchYear] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleYearChange = selectedBranchYear => {
        setBranchYear(selectedBranchYear)
    }
    const handleBranchChange = selectBranch => {
        setBranch(selectBranch)
    }
    const toggleModal = useCallback(() => {
        setIsModalOpen(prevState => !prevState);
    }, []);

    return (
        <div className='col-span-8 bg-gray-200'>
            <ContentProfHeader currentPage={currentPage}>
                <HeaderContent currentPage={currentPage}
                    branches={branches} currentBranch={branch} handleBranchChange={handleBranchChange}
                    currentYear={branchYear} handleYearChange={handleYearChange}
                />
            </ContentProfHeader>

            {currentPage === 'Home' && (
                <>
                    <InsertCourseModal ownerBranchTag={branch_tag} isVisible={isModalOpen} onClose={toggleModal} />
                    <Scheduler />
                    <ButtonCom style='rounded bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4'
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