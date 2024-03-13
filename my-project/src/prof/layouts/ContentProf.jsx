import { useState, useCallback } from 'react';
import ContentProfHeader from '../components/ContentProfHeader';
import HeaderContent from '../components/HeaderContent';
import Scheduler from '../modules/Scheduler';
import InsertCourseModal from '../modules/InsertCourseModal';
import ButtonCom from '../components/ButtonCom';

export default function ContentProf({ currentPage, userData }) {
    const { id, name: myProfName, role, branch_tag: initialBranch } = userData;

    const [profState, setProfState] = useState({
        branch: initialBranch,
        branchYear: '',
        profName: myProfName,
        isModalOpen: false
    });

    const { branch, profName, branchYear, isModalOpen } = profState;

    const handleYearChange = selectedBranchYear => {
        setProfState(prevState => ({ ...prevState, branchYear: selectedBranchYear }));
    };
    const handleBranchChange = selectedBranch => {
        setProfState(prevState => ({ ...prevState, branch: selectedBranch }));
        handleYearChange();
    };
    const handleProfChange = selectedProf => {
        setProfState(prevState => ({ ...prevState, profName: selectedProf }));
    };
    const toggleModal = useCallback(() => {
        setProfState(prevState => ({ ...prevState, isModalOpen: !prevState.isModalOpen }));
    }, []);

    return (
        <div className='col-span-8 bg-gray-200'>
            <ContentProfHeader currentPage={currentPage}>
                <HeaderContent currentPage={currentPage}
                    currentBranch={branch} handleBranchChange={handleBranchChange}
                    currentYear={branchYear} handleYearChange={handleYearChange}
                    currentProfName={myProfName} handleProfChange={handleProfChange}
                    profRole={role}
                />
            </ContentProfHeader>

            <Scheduler
                curPage={currentPage}
                curBranchYear={branchYear}
                curProf={profName}
                userData={userData}
            />

            {currentPage === 'Home' && (
                <>
                    <InsertCourseModal ownerBranchTag={branch} isVisible={isModalOpen} onClose={toggleModal} />
                    <ButtonCom style='rounded bg-blue-500 hover:bg-blue-700 text-white font-bold mb-4 py-2 px-4'
                        text='Add Course' type='button' onClick={toggleModal}
                    />
                </>
            )}
        </div>
    );
}