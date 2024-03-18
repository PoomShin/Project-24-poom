import { useState, useCallback, useEffect } from 'react';
import { useGetGroupsStatusByBranch } from '../../api/Profs_API';
import ContentProfHeader from '../modules/ContentProfHeader';
import Scheduler from '../modules/Scheduler';
import InsertCourseModal from '../modules/InsertCourseModal';
import ButtonCom from '../components/ButtonCom';

export default function ContentProf({ currentPage, userData }) {
    const { name: myProfName, role, branch_tag: initialBranch } = userData;
    const [profState, setProfState] = useState({
        branch: initialBranch,
        branchYear: '',
        profName: myProfName,
        labRoom: '',
    });
    const { branch, profName, branchYear, labRoom } = profState;
    const handleBranchChange = selectedBranch => {
        setProfState(prevState => ({ ...prevState, branch: selectedBranch }));
        handleYearChange();
    };
    const handleYearChange = selectedBranchYear => {
        setProfState(prevState => ({ ...prevState, branchYear: selectedBranchYear }));
    };
    const handleProfChange = selectedProf => {
        setProfState(prevState => ({ ...prevState, profName: selectedProf }));
    };
    const handleLabChange = selectedLab => {
        setProfState(prevState => ({ ...prevState, labRoom: selectedLab }));
    }

    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleModal = useCallback(() => {
        setIsModalOpen(prev => !prev)
    }, []);

    const { data: groupsStatus, refetch: refetchGroupsStatus } = useGetGroupsStatusByBranch(branch);
    useEffect(() => {
        refetchGroupsStatus();
    }, [branch]);

    return (
        <div className='col-start-3 col-span-15 border-2 border-b-0 border-solid border-black bg-white'>
            <ContentProfHeader currentPage={currentPage}
                currentBranch={branch} handleBranchChange={handleBranchChange}
                currentYear={branchYear} handleYearChange={handleYearChange}
                currentProfName={profName} handleProfChange={handleProfChange} profRole={role}
                currentLab={labRoom} handleLabChange={handleLabChange}
            />

            <Scheduler
                userData={userData}
                curPage={currentPage}
                curBranch={branch}
                curBranchYear={branchYear}
                curProf={profName}
                curLab={labRoom}
                groupsStatus={groupsStatus}
            />

            <InsertCourseModal ownerBranchTag={branch} isVisible={isModalOpen} onClose={toggleModal} />
            <ButtonCom style='rounded bg-blue-500 hover:bg-blue-700 text-white font-bold mb-4 py-2 px-4'
                text='Add Course' type='button' onClick={toggleModal}
            />
        </div>
    );
}