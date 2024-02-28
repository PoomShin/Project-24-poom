import { createPortal } from 'react-dom';
import { useState } from 'react';
import { useAddProfMutation } from '../../context/Admin-Context';

export default function AddProfModal({ branchTag, isVisible, onClose }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'prof',
        branch_tag: branchTag || ''
    });

    const addProfMutation = useAddProfMutation();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await addProfMutation.mutateAsync(formData);
            alert(result.message);
        } catch (error) {
            console.error(error.message);
            alert(error.message);
        } finally {
            onClose();
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return isVisible ? (
        <PortalContainer>

            <form method='post' onSubmit={handleSubmit} className=' bg-gray-300 p-4 rounded-xl shadow-2xl ' >
                <h1 className='text-xl text-center text-black'>Add Prof</h1>
                <div className='my-3'>
                    <input className='mt-1 p-1 w-full border-2 border-solid rounded border-black'
                        type='text'
                        id='name'
                        placeholder='your name'
                        onChange={handleChange}
                        value={formData.name}
                        required
                    />
                </div>
                <div className='mb-3'>
                    <input className='mt-1 p-1 w-full border-2 border-solid rounded border-black'
                        type='email'
                        id='email'
                        placeholder='your email'
                        onChange={handleChange}
                        value={formData.email}
                        required
                    />
                </div>
                <div className='mb-3'>
                    <input className='mt-1 p-1 w-full border-2 border-solid border-black rounded'
                        type='text'
                        id='branch_tag'
                        readOnly
                        onChange={handleChange}
                        value={formData.branch_tag}
                    />
                </div>

                <button className='my-2 py-1 px-8 rounded bg-green-500 text-white hover:bg-green-600 hover:text-gray-600 '
                    type='submit'
                >
                    <span className='text-lg font-bold'>
                        {addProfMutation.isLoading ? 'Submitting...' : 'Submit'}
                    </span>
                </button>

                <button className='my-2 py-1 px-8 rounded bg-red-500 text-white hover:bg-red-600 hover:text-gray-600'
                    type='button'
                    onClick={onClose}
                >
                    <span className='text-lg font-bold'>Close</span>
                </button>
            </form>
        </PortalContainer>
    ) : undefined;
}

const PortalContainer = ({ children }) => {
    return (
        createPortal(
            <div className='fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-gray-800 bg-opacity-60 z-50'>
                {children}
            </div>,
            document.getElementById('root-modal')
        )
    )
}