import { useNavigate } from 'react-router-dom';
import { sidebarItems } from '../data_functions/constantData';

export default function Sidebar({ currentPage, setCurrentPage }) {
    const navigate = useNavigate();

    const handleChangePage = (newPage) => {
        setCurrentPage(newPage);
        if (newPage === 'Logout') navigate('/');
    };

    return (
        <div className='col-span-1 flex flex-col items-center border-2 border-t-0 border-l-0 border-black min-h-dvh'>
            {sidebarItems.map(({ key, label, icon }) => (
                <div className={`w-full my-3 py-1 hover:bg-slate-200 hover:cursor-pointer ${currentPage === key ? 'bg-sky-200/75' : ''}`}
                    key={key}
                    onClick={() => handleChangePage(key)}
                >
                    <img src={icon} className='inline mr-2 h-8' alt={`${label} icon`} />
                    <p className='inline md:text-lg text-[7px]'>{label}</p>
                </div>
            ))}
        </div>
    );
}