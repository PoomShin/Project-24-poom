import { useEffect } from 'react';
import ku_logo from '../../assets/ku_logo.png';
import notification from '../../assets/notification.png';
import userProfile from '../../assets/user.png';

export default function Navbar({ name }) {
    return (
        <div className='col-span-12 flex items-center justify-between bg-teal-900 text-white px-4'>
            <img src={ku_logo} alt="KU Logo" className='h-24' />
            <div>
                <img src={notification} alt='Notification' className='inline h-9' />
                <p className='inline px-5'>{name}</p>
                <img src={userProfile} alt='User Profile' className='inline h-10' />
            </div>
        </div>
    );
}
