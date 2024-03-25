import src_logo from '../../assets/SRC_ENG_LOGO.gif';

const LoginHeader = () => (
    <div className='flex flex-col items-center mb-6'>
        <img src={src_logo} className='w-52' alt="Logo" />
        <h1 className='mt-4 text-2xl font-semibold'>KU Scheduler</h1>
    </div>
);

export default LoginHeader;