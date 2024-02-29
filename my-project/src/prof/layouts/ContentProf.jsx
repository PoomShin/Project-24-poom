import { useState, useCallback } from 'react';
import { useBranchesContext } from '../../context/Prof-Context';
import { IconData } from '../data/IconData';

export default function ContentProf({ currentPage, userData }) {
    const { branches } = useBranchesContext();
    const { id, name, email, role, branch_tag } = userData;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [branch, setBranch] = useState(branch_tag);
    const [branchYear, setBranchYear] = useState('');

    const icon = IconData[currentPage];

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
            <div className='overflow-auto grid grid-cols-6 items-center border-b border-solid border-t-2 border-black bg-sky-200/75 p-4 mb-6'>
                <div className='col-start-1'>
                    <img src={icon} className='h-10' />
                    <p className='inline text-[160%] font-semibold ml-2'>{currentPage}</p>
                </div>
                <TabBarContent currentPage={currentPage}
                    branches={branches} currentBranch={branch} handleBranchChange={handleBranchChange}
                    currentYear={branchYear} handleYearChange={handleYearChange}
                />
            </div>

            {currentPage === 'Home' && (
                <div>
                    <InsertCourseModal isVisible={isModalOpen} onClose={toggleModal} />
                    <Scheduler />
                    <ButtonCom style='rounded bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4'
                        text='Add Course' type='button' onClick={toggleModal}
                    />
                </div>
            )}
        </div>
    );
}

import Scheduler from '../modules/Scheduler';
import InsertCourseModal from '../modules/InsertCourseModal';
import TabBarContent from '../components/TabBarContent';
import ButtonCom from '../components/ButtonCom';