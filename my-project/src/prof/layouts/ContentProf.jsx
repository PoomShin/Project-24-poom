import { useState, useCallback, createContext, useContext } from 'react';
import { getGroupsStatusByBranch } from '../../api/Profs_API';
import ContentProfHeader from './ContentProfHeader';
import Scheduler from '../modules/Scheduler';
import InsertCourseModal from '../modules/InsertCourseModal';
import ButtonCom from '../components/ButtonCom';

const ContentProfStateContext = createContext();

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
        <ContentProfStateContext.Provider value={sharedState}>
            <div className='col-start-3 col-span-15 border-2 border-b-0 border-solid border-black bg-white'>
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

                <InsertCourseModal ownerProfBranch={initialProfBranch} isVisible={isModalOpen} onClose={toggleModal} />
                <ButtonCom style='rounded bg-blue-500 hover:bg-blue-700 text-white font-bold mb-4 py-2 px-4'
                    text='Add Course' type='button'
                    onClick={toggleModal}
                />
            </div>
        </ContentProfStateContext.Provider>
    );
}

export const useContentProfStateContext = () => useContext(ContentProfStateContext);