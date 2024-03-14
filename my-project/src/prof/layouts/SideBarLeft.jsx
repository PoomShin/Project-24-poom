import { useNavigate } from 'react-router-dom';
import { IconData } from '../data/IconData';

const menuItems = [
    { key: 'Home', label: 'Home', icon: IconData['Home'] },
    { key: 'Prof', label: 'Professors', icon: IconData['Prof'] },
    { key: 'Lab', label: 'Laboratory', icon: IconData['Lab'] },
    { key: 'Logout', label: 'Log out', icon: IconData['Logout'] }
];

export default function SideBarLeft({ currentPage, setCurrentPage }) {
    const navigate = useNavigate();

    const handleChangePage = (newPage) => {
        setCurrentPage(newPage);
        if (newPage === 'Logout') navigate('/');
    };

    return (
        <div className='min-h-dvh flex flex-col items-start col-span-2 border-2 border-t-2 border-l-0 border-black hover:cursor-pointer font-semibold'>
            {menuItems.map(({ key, label, icon }) => (
                <div className={`w-full flex gap-x-3 hover:bg-slate-200 ${currentPage === key ? 'bg-sky-200/75' : ''} my-3 py-1`}
                    key={key}
                    onClick={() => handleChangePage(key)}
                >
                    <img src={icon} className='ml-3 h-7' alt={label} />
                    <p className='inline sm:text-lg text-xs'>{label}</p>
                </div>
            ))}
        </div>
    );
}