const menuItems = [
    { key: 'Branch', label: 'Branch', icon: branchIcon },
    { key: 'Course', label: 'Course', icon: courseIcon },
    { key: 'Logout', label: 'Log out', icon: logoutIcon },
];

export default function Sidebar({ setCurrentPage, currentPage }) {
    const navigate = useNavigate();

    const handleChangePage = (newPage) => {
        setCurrentPage(newPage);
        if (newPage === 'Logout') navigate('/');
    };

    return (
        <div className='col-span-1 flex flex-col items-center border-2 border-t-0 border-l-0 border-black min-h-dvh'>
            {menuItems.map(({ key, label, icon }) => (
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

import { useNavigate } from 'react-router-dom';
import branchIcon from '../assets/branch.png'
import courseIcon from '../assets/course.png'
import logoutIcon from '../assets/logoutIcon.png'