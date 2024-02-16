export default function GoogleButton() {
    return (
        <button className='flex items-center space-x-2 rounded-full shadow-md hover:shadow-lg cursor-pointer mt-3 p-3 bg-white '
            onClick={null}
        >
            <img className="w-8 h-8" src={google_logo} alt='Google Logo' />
            <span className="font-medium text-gray-800">Login with Google</span>
        </button>
    )
}

import google_logo from '../../assets/google-logo.svg'