import { useNavigate } from 'react-router-dom';
import homeIcon from '../assets/home.png'
import proIcon from '../assets/teacher.png'
import labIcon from '../assets/laboratory.png'
import logoutIcon from '../assets/logoutIcon.png'

const menuItems = [
    { key: 'Home', label: 'Home', icon: homeIcon },
    { key: 'Professors', label: 'Professors', icon: proIcon },
    { key: 'Laboratory', label: 'Laboratory', icon: labIcon },
    { key: 'Logout', label: 'Log out', icon: logoutIcon }
];

export default function SideBarLeft({ currentPage, setCurrentPage }) {
    const navigate = useNavigate();

    const handleChangePage = (newPage) => {
        setCurrentPage(newPage);
        if (newPage === 'Logout') navigate('/');
    };

    return (
        <div className="col-span-2 flex flex-col items-center border-2 border-t-2 border-l-0 border-black min-h-dvh">
            {menuItems.map(({ key, label, icon }) => (
                <div className={` w-full my-3 py-1 ${currentPage === key ? 'bg-sky-200/75' : ''}`}
                    key={key}
                    onClick={() => handleChangePage(key)}
                >
                    <img src={icon} className='inline mr-2 h-7' alt={`${label} icon`} />
                    <p className='inline sm:text-lg text-[9px] '>{label}</p>
                </div>
            ))}
        </div>
    );
}