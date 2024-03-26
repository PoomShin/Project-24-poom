import { IconData } from "../data_functions/iconData";

export default function Navbar({ name }) {
    return (
        <div className='col-span-12 flex items-center justify-between bg-teal-900 text-white px-4'>
            <img src={IconData['KULogo']} alt="KU Logo" className='h-24' />
            <div>
                <img src={IconData['Notification']} alt='Notification' className='inline h-9' />
                <p className='inline px-5'>{name}</p>
                <img src={IconData['UserProfile']} alt='User Profile' className='inline h-10' />
            </div>
        </div>
    );
}