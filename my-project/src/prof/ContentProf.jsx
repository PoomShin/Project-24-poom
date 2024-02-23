import { useState, useCallback } from 'react';
import Timeline from './components/Timeline';
import InsertCourseModal from './modals/InsertCourseModal';
import { useBranchesContext } from '../context/Prof-Context';
import { IconData } from './data/IconData';

export default function ContentProf({ currentPage, userData }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [branch, setBranch] = useState(userData.branchtag);
    const [year, setYear] = useState('');
    const { branches } = useBranchesContext();
    const icon = IconData[currentPage];

    const { id, name, email, role, branch_tag } = userData;

    const toggleModal = useCallback(() => { setIsModalOpen(prevState => !prevState); }, []);
    const handleYearChange = selectedYear => setYear(selectedYear);
    const handleBranchChange = selectBranch => setBranch(selectBranch);

    const renderBranchButton = () => {
        if (currentPage === 'Home') {
            return (
                <div className='col-start-3 relative flex'>
                    <select onChange={(e) => handleBranchChange(e.target.value)} value={branch} className='px-[20%] py-2 bg-teal-900 border border-gray-400 rounded-md font-semibold text-white hover:bg-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'>
                        <option value=''>Select Branch</option>
                        {branches && branches.map((branchData, index) => (
                            <option key={index} value={branchData.branch_tag}>
                                {branchData.branch_tag}
                            </option>
                        ))}
                    </select>
                </div>
            );
        }
        return null;
    };

    const renderYearDropdown = () => {
        if (currentPage === 'Home') {
            return (
                <div className='col-start-5 relative flex'>
                    <select onChange={(e) => handleYearChange(e.target.value)} value={year} className='px-[20%] py-2 bg-teal-900 border border-gray-400 rounded-md font-semibold text-white hover:bg-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'>
                        <option value=''>Select Year</option>
                        {Array.from({ length: 4 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{branch_tag}/{i + 1}</option>
                        ))}
                    </select>
                </div>
            );
        }
        return null;
    };

    return (
        <div className='col-span-8 bg-gray-200'>
            <div className='grid grid-cols-6 items-center border-b border-solid border-t-2 border-black bg-sky-200/75 p-4 mb-6 overflow-auto'>
                <div className='col-start-1'>
                    <img src={icon} className='h-10' />
                    <p className='inline text-[160%] font-semibold ml-2'>{currentPage}</p>
                </div>
                {renderBranchButton()}
                {renderYearDropdown()}
            </div>

            {currentPage === 'Home' && (
                <>
                    <Timeline />
                    <InsertCourseModal isVisible={isModalOpen} onClose={toggleModal} />
                    <button className='rounded bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-4'
                        type='button'
                        onClick={toggleModal}
                    >
                        Add Course
                    </button>
                </>
            )}
        </div>
    );
}