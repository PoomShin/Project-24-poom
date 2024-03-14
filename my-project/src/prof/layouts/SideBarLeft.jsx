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
    const textPage = (key) => currentPage === key && 'bg-light_blue/65';

    const handleChangePage = (newPage) => {
        setCurrentPage(newPage);
        if (newPage === 'Logout') navigate('/');
    };

    return (
        <div className='min-h-dvh flex flex-col items-start col-span-2 border-t-2 border-black bg-ghost_white hover:cursor-pointer'>
            {menuItems.map(({ key, label, icon }) => (
                <div className={'w-full flex gap-x-3 my-2 py-1 hover:bg-light_blue/65 ' + textPage(key)}
                    key={key}
                    onClick={() => handleChangePage(key)}
                >
                    <img src={icon} className='ml-3 h-7' alt={label} />
                    <p className='inline sm:text-lg text-xs font-semibold text-black'>{label}</p>
                </div>
            ))}
        </div>
    );
}