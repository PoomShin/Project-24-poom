import { IconData } from '../data/IconData';

export default function ContentProfHeader({ children, currentPage }) {
    const icon = IconData[currentPage];
    return (
        <div className='overflow-auto grid grid-cols-10 items-center bg-light_blue p-4'>
            <div className='flex gap-2 items-center col-start-1'>
                <img src={icon} className='h-10' />
                <p className='text-3xl font-semibold text-teal-950'>{currentPage}</p>
            </div>
            {children}
        </div>
    )
}