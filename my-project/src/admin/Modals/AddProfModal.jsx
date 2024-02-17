export default function AddProfModal({ branchTag, isVisible, onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "prof",
        branchtag: branchTag || ""
    });
    const mutation = useAddProfMutation();

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return isVisible ? (
        <PortalContainer>
            <form method="post" onSubmit={handleSubmit} >
                <div className='my-3'>
                    <input className='mt-1 p-1 w-full border-2 border-solid rounded border-black'
                        type='text'
                        id='name'
                        placeholder="your name"
                        onChange={handleChange}
                        value={formData.name}
                        required
                    />
                </div>
                <div className='mb-3'>
                    <input className='mt-1 p-1 w-full border-2 border-solid rounded border-black'
                        type='email'
                        id='email'
                        placeholder="your email"
                        onChange={handleChange}
                        value={formData.email}
                        required
                    />
                </div>
                <div className='mb-3'>
                    <input className='mt-1 p-1 w-full border-2 border-solid border-black rounded'
                        type='text'
                        id='branchtag'
                        readOnly
                        onChange={handleChange}
                        value={formData.branchtag}
                    />
                </div>

                <button className='my-2 py-1 px-8 rounded bg-green-500 text-white hover:bg-green-600'
                    type='submit'
                    disabled={mutation.isLoading}
                >
                    <span className="text-lg font-bold">
                        {mutation.isLoading ? 'Submitting...' : 'Submit'}
                    </span>
                </button>

                <button className='my-2 py-1 px-8 rounded bg-red-500 text-white hover:bg-red-600'
                    type="button"
                    onClick={onClose}
                >
                    <span className="text-lg font-bold">Close</span>
                </button>
            </form>
        </PortalContainer>
    ) : undefined;
}

const PortalContainer = ({ children }) => {
    return (
        createPortal(
            <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-gray-800 bg-opacity-50 z-50">
                <h1 className='text-xl text-center text-white'>Add Prof</h1>
                {children}
            </div>,
            document.getElementById('root-modal')
        )
    )
}

const useAddProfMutation = () => {
    return useMutation(
        async (formData) => {
            try {
                const response = await axios.post('/admin/addProf', formData);
                return response.data;
            } catch (error) {
                throw new Error(error.response.data.error || 'Unknown error');
            }
        },
        {
            onSuccess: (data) => {
                if (data.success) {
                    const { newProf } = data;
                    alert("Professor added successfully", newProf);
                } else {
                    alert(data.error || 'Unknown error');
                }
            },
            onError: (error) => {
                console.error(error.message);
                alert('An error occurred during submission');
            },
        }
    );
};

import { createPortal } from 'react-dom';
import { useMutation } from 'react-query';
import { useState } from "react";
import axios from 'axios';
