import { useEffect } from 'react';
import ku_logo from '../../assets/ku_logo.png';
import notification from '../../assets/notification.png';
import userProfile from '../../assets/profile.png';

export default function NavbarProf({ name, role, img }) {
    return (
        <div className='col-span-12 flex items-center justify-between bg-teal-900 text-white px-4'>
            <img src={ku_logo} alt='KU_Logo' className='h-24' />

            <div className='flex items-center'>
                <img src={notification} alt='Notification' className='h-9' />
                <p className='px-5'>{name}</p>

                <div className='flex flex-col text-center'>
                    <img src={img ? img : userProfile} alt='User_Profile' className='h-14 rounded-full' />
                    <p className='text-center text-2xl'>{role}</p>
                </div>
            </div>

        </div>
    );
}