import { IconData } from '../data/IconData';

export default function ContentProfHeader({ children, currentPage }) {
    const icon = IconData[currentPage];
    return (
        <div className='overflow-auto grid grid-cols-10 items-center border-b border-solid border-t-2 border-black bg-sky-200/75 p-4 mb-6'>
            <div className='col-start-1'>
                <img src={icon} className='h-10' />
                <p className='inline text-[160%] font-semibold ml-2'>{currentPage}</p>
            </div>
            {children}
        </div>
    )
}