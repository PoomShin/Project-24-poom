import { useState, useCallback } from 'react';
import { IconData } from './data/IconData';
import Timeline from './components/Timeline';
import InsertCourseModal from './modals/InsertCourseModal';
import { useBranchesContext } from '../context/Prof-Context';

export default function ContentProf({ currentPage, userData }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { branches } = useBranchesContext();
    const [year, setYear] = useState('');
    const [branch, setBranch] = useState(userData.branchtag);

    const { id, name, email, role, branchtag } = userData;
    const icon = IconData[currentPage];

    const toggleModal = useCallback(() => { setIsModalOpen(prevState => !prevState); }, []);
    const handleYearChange = selectedYear => setYear(selectedYear);
    const handleBranchChange = selectBranch => setBranch(selectBranch);

    const renderBranchButton = () => {
        if (currentPage === 'Home') {
            return (
                <div className='col-start-3 relative flex'>
                    <select onChange={(e) => handleBranchChange(e.target.value)} value={branch} className='px-[20%] py-2 bg-teal-900 border border-gray-400 rounded-md font-semibold text-white hover:bg-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50'>
                        <option value=''>Select Branch</option>
                        {branches && branches.map((branchData) => (
                            <option key={branchData.id} value={branchData.branchtag}>
                                {branchData.branchtag}
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
                            <option key={i + 1} value={i + 1}>{branchtag}/{i + 1}</option>
                        ))}
                    </select>
                </div>
            );
        }
        return null;
    };

    return (
        <div className='col-span-8 bg-gray-200'>
            <div className="grid grid-cols-6 items-center bg-sky-200/75 border-b border-solid border-t-2 border-black p-4 mb-6">
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
                    <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4'
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

const btn = () => {
    return (
        <div className="row-start-7 items-center ">
            <div className="items-center grid grid-cols-6">
                <div className="relative flex col-start-3">
                    <button className="px-[5%] py-1 bg-gray-400 border-2 border-black rounded-md font-semibold text-Black hover:bg-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                        <img src={IconData['Plus']} className="h-10 px-5" />
                        <p>AddCourse</p>
                    </button>
                    <button className="mx-1 px-[15%] py-1 bg-gray-400 border-2 border-black rounded-md font-semibold text-Black hover:bg-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                        <img src={IconData['Export']} className="h-10" />
                        <p>Export</p>
                    </button>
                </div>
            </div>
        </div>
    )
}