const iconMap = {
    'Home': homeIcon,
    'Professors': profIcon,
    'Laboratory': labIcon,
};

export default function Contentpro({ currentPage }) {
    const year = 'YEAR';

    const icon = iconMap[currentPage];
    const expot = exprot;
    const addcourse = plus;

    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => { setIsOpen(!isOpen); };

    const [isOpen1, setIsOpen1] = useState(false);
    const toggleDropdown1 = () => { setIsOpen1(!isOpen1); };
    return (
        <div className="col-span-8 bg-gray-200 grid grid-rows-7">
            <div className="grid grid-cols-6 items-center bg-sky-200/75 border-b border-solid border-t-2 border-black p-4 mb-6">
                <div className='col-start-1'>
                    <img src={icon} className=" h-10" />
                    <p className="inline text-[160%] font-semibold ml-2">{currentPage}</p>
                </div>
                {currentPage === 'Home' && (
                    <div className="col-start-3 relative flex">
                        <button className="px-[20%] py-2 bg-teal-900 border border-gray-400 rounded-md font-semibold text-white hover:bg-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                            <p>Barnch</p>
                            <p>T-12</p>
                        </button>
                    </div>
                )}
                {currentPage === 'Home' && (
                    <div className="col-start-5 relative flex">
                        <button onClick={toggleDropdown1} className="px-[20%] py-2 bg-teal-900 border border-gray-400 rounded-md font-semibold text-white hover:bg-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                            <p>{year}</p>
                            <p></p>
                            <svg className="w-4 h-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 12a1 1 0 0 1-0.707-0.293l-4-4a1 1 0 1 1 1.414-1.414L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4A1 1 0 0 1 10 12z" clipRule="evenodd" />
                            </svg>
                        </button>
                        {isOpen1 && (
                            <div className="col-start-4 absolute top-14  mt-2 w-32 bg-white border border-gray-400 rounded-md shadow-lg z-10">
                                <ul>
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">T-12/1</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">T-12/2</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">T-12/3</a>
                                    </li>
                                    <li>
                                        <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">T-12/4</a>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="row-start-7 items-center ">
                <div className="items-center grid grid-cols-6">
                    <div className="relative flex col-start-3">
                        <button className="px-[5%] py-1 bg-gray-400 border-2 border-black rounded-md font-semibold text-Black hover:bg-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                            <img src={addcourse} className=" h-10 px-5" />
                            <p>AddCourse</p>
                        </button>
                        <button className="mx-1 px-[15%] py-1 bg-gray-400 border-2 border-black rounded-md font-semibold text-Black hover:bg-gray-400 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50">
                            <img src={expot} className=" h-10" />
                            <p>Export</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Import assets
import { useState } from 'react';
import homeIcon from '../assets/home.png';
import labIcon from '../assets/laboratory.png';
import profIcon from '../assets/teacher.png';
import exprot from '../assets/export-file.png';
import plus from '../assets/plus.png';