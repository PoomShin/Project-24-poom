import ku_logo from '../../assets/ku_logo.png';
import notification from '../../assets/notification.png';
import userProfile from '../../assets/profile.png';

export default function NavbarProf({ name, role, img }) {
    return (
        <div className='col-start-1 col-span-20 flex items-center justify-between bg-teal-900 text-white sm:text-sm text-xs px-4'>
            <img src={ku_logo} alt='KU_Logo' className='sm:h-24 h-12' />

            <div className='flex items-center'>
                <img src={notification} alt='Notification' className='sm:h-9 h-6' />
                <p className='sm:px-5 px-2'>{name}</p>

                <div className='flex flex-col items-center py-1'>
                    <img className='sm:h-14 sm:w-14 h-7 w-7 rounded-full'
                        src={img ? img : userProfile}
                        alt='User_Profile'
                    />
                    <p className='font-bold mt-1'>{role}</p>
                </div>
            </div>

        </div>
    );
}