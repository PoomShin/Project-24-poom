import { useMemo } from 'react';
import { tabbarIconMap } from '../data_functions/constantData';

export default function TabBar({ currentPage, toggleModal }) {
  const icon = useMemo(() => tabbarIconMap[currentPage], [currentPage]);

  return (
    <div className='items-center bg-sky-200/75 border-b border-solid border-black p-4 mb-6 flex content-center justify-between'>
      <div className='flex flex-col'>
        <img src={icon} className='inline w-12 h-12 self-center' />
        <p className='inline text-3xl font-semibold ml-2'>{currentPage}</p>
      </div>
      <form className='col-start-7'>
        <button className={`inline-block px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 ${currentPage === 'Course' ? 'invisible' : ''}`}
          type='button'
          onClick={toggleModal}
        >
          Add {currentPage}
        </button>
      </form>
    </div>
  );
}