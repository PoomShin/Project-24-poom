import { useState, useCallback, useEffect } from 'react';
import ContentProfHeader from '../components/ContentProfHeader';
import HeaderContent from '../components/HeaderContent';
import Scheduler from '../modules/Scheduler';
import InsertCourseModal from '../modules/InsertCourseModal';
import ButtonCom from '../components/ButtonCom';
import { useGetGroupsStatusByBranch } from '../../api/Profs_API';

export default function ContentProf({ currentPage, userData }) {
    const { id, name: myProfName, role, branch_tag: initialBranch } = userData;

    const [profState, setProfState] = useState({
        branch: initialBranch,
        branchYear: '',
        profName: myProfName,
        labRoom: '',
        isModalOpen: false
    });
    const { branch, profName, branchYear, isModalOpen, labRoom } = profState;

    const { data: groupsStatus, refetch: refetchGroupsStatus } = useGetGroupsStatusByBranch(branch);

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
    const handleLabChange = selectedLab => {
        setProfState(prevState => ({ ...prevState, labRoom: selectedLab }));
    }
    const toggleModal = useCallback(() => {
        setProfState(prevState => ({ ...prevState, isModalOpen: !prevState.isModalOpen }));
    }, []);

    useEffect(() => {
        refetchGroupsStatus();
    }, [branch]);

    return (
        <div className='col-start-3 col-span-15 border-2 border-b-0 border-solid border-black bg-white'>
            <ContentProfHeader currentPage={currentPage}>
                <HeaderContent currentPage={currentPage}
                    currentBranch={branch} handleBranchChange={handleBranchChange}
                    currentYear={branchYear} handleYearChange={handleYearChange}
                    currentProfName={profName} handleProfChange={handleProfChange}
                    currentLab={labRoom} handleLabChange={handleLabChange}
                    profRole={role}
                />
            </ContentProfHeader>

            <Scheduler
                curPage={currentPage}
                curBranch={branch}
                curBranchYear={branchYear}
                curProf={profName}
                curLab={labRoom}
                userData={userData}
                groupsStatus={groupsStatus}
            />

            {currentPage === 'Home' && (
                <>
                    <InsertCourseModal ownerBranchTag={branch} isVisible={isModalOpen} onClose={toggleModal}
                        refetchGroupsStatus={refetchGroupsStatus}
                    />
                    <ButtonCom style='rounded bg-blue-500 hover:bg-blue-700 text-white font-bold mb-4 py-2 px-4'
                        text='Add Course' type='button' onClick={toggleModal}
                    />
                </>
            )}
        </div>
    );
}