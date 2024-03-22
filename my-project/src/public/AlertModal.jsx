import { FaTimes } from 'react-icons/fa';

export default function AlertModal({ isOpen, onClose, message }) {
    return (
        isOpen && (
            <div className='fixed top-28 left-0 right-0 flex items-center justify-center z-[60]'>
                <div className='fixed inset-0 bg-gray-900 opacity-50'></div>
                <div className='absolute top-1/2 transform -translate-y-1/2 bg-white text-black w-96 rounded-lg p-4 z-50'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-xl font-semibold'>Alert</h2>
                        <button onClick={onClose} className='text-gray-500'>
                            <FaTimes />
                        </button>
                    </div>
                    <p>{message}</p>
                    <button className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        )
    );
};