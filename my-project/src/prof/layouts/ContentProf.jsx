import { useState, useCallback } from 'react';
import { getGroupsStatusByBranch, getExportDataByBranch } from '../../api/Profs_API';
import ContentProfHeader from './ContentProfHeader';
import Scheduler from '../modules/Scheduler';
import InsertCourseModal from '../modules/InsertCourseModal';
import ButtonCom from '../components/ButtonCom';
import ExportButton from '../modules/ExportButton';

export default function ContentProf({ userData, currentPage }) {
    const { name: initialProfName, role, branch_tag: initialProfBranch } = userData;
    const [sharedState, setSharedState] = useState({
        currentBranch: initialProfBranch,
        currentBranchYear: '',
        currentProfName: initialProfName,
        currentProfRole: role,
        currentLabRoom: '',
    });
    const { data: groupsBranchStatus } = getGroupsStatusByBranch(sharedState.currentBranch);
    const { data: exportDataByBranch } = getExportDataByBranch(sharedState.currentBranch);

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleBranchChange = selectedBranch => {
        setSharedState(prevState => ({
            ...prevState,
            currentBranch: selectedBranch,
            currentBranchYear: '', // Update currentBranchYear here if needed
        }));
    };
    const handleBranchYearChange = selectedBranchYear => {
        setSharedState(prevState => ({ ...prevState, currentBranchYear: selectedBranchYear }));
    };
    const handleProfChange = selectedProf => {
        setSharedState(prevState => ({ ...prevState, currentProfName: selectedProf }));
    };
    const handleLabRoomChange = selectedLab => {
        setSharedState(prevState => ({ ...prevState, currentLabRoom: selectedLab }));
    }

    const toggleModal = useCallback(() => {
        setIsModalOpen(prev => !prev)
    }, []);

    return (
        <div className='col-start-3 col-span-15 border-2 border-b-0 border-solid border-black bg-white'>
            <InsertCourseModal ownerProfBranch={initialProfBranch} isVisible={isModalOpen} onClose={toggleModal} />
            <ContentProfHeader
                page={currentPage}
                sharedState={sharedState}
                onBranchChange={handleBranchChange}
                onBranchYearChange={handleBranchYearChange}
                onProfChange={handleProfChange}
                onLabRoomChange={handleLabRoomChange}
            />

            <Scheduler
                selectedPage={currentPage}
                sharedState={sharedState}
                groupsStatus={groupsBranchStatus}
            />

            <div className='flex gap-x-4 rounded-sm bg-sky-600 shadow-sm shadow-sky-500 mt-2 mx-2 pt-2 pb-4'>
                <ButtonCom style='bg-blue-300 hover:bg-blue-700 text-white font-bold py-2 px-4 ml-2'
                    text='Add Course' type='button'
                    onClick={toggleModal}
                />
                <ExportButton currentBranch={sharedState.currentBranch} exportDataByBranch={exportDataByBranch} />
            </div>
        </div>
    );
}