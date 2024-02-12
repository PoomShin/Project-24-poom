export default function AddBranchModal({ isVisible, onClose }) {
    const [formData, setFormData] = useState({
        branchname: "",
        branchtag: "",
        coursetag: "",
    });
    const mutation = useMutation(data => axios.post('/admin/addBranch', data), {
        onSuccess: () => {
            alert('Branch added successfully!');
            onClose();
        },
        onError: (error) => {
            alert(`Failed to add branch: ${error.message}`);
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    return isVisible ? (
        createPortal(
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-800 bg-opacity-50">
                <form className='bg-teal-900 p-4' onSubmit={handleSubmit} method="post">
                    <h1 className='text-xl text-center text-white'>Add Branch</h1>

                    <div className='my-3'>
                        <input className='w-full border-2 border-solid border-black rounded mt-1 p-1'
                            type='text'
                            id='branchname'
                            placeholder="branch name"
                            required
                            onChange={handleChange}
                            value={formData.branchname}
                        />
                    </div>
                    <div className='mb-3'>
                        <input className='w-full border-2 border-solid border-black rounded mt-1 p-1'
                            type='text'
                            id='branchtag'
                            placeholder="xx(2 num)"
                            required
                            maxLength="2"
                            pattern="\d{2}"
                            onChange={handleChange}
                            value={formData.branchtag}
                        />
                    </div>
                    <div className='mb-3'>
                        <input className='w-full border-2 border-solid border-black rounded mt-1 p-1'
                            type='text'
                            id='coursetag'
                            placeholder="course tag"
                            required
                            maxLength="5"
                            onChange={handleChange}
                            value={formData.coursetag}
                        />
                    </div>

                    <button type='submit' className='my-2 py-1 px-8 rounded text-white bg-green-500 hover:bg-green-600' disabled={mutation.isLoading}>
                        <span className="text-lg font-bold">{mutation.isLoading ? 'Submitting...' : 'Submit'}</span>
                    </button>

                    <button type='button' className='my-2 py-1 px-8 text-white bg-red-500 rounded hover:bg-red-600' onClick={onClose}>
                        <span className="text-lg font-bold">Close</span>
                    </button>
                </form>
            </div>,
            document.getElementById('root-modal')
        )
    ) : null;
}

import { useState } from "react";
import { createPortal } from 'react-dom';
import { useMutation } from 'react-query';
import axios from "axios";

