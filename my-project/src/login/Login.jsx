import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';

import LoginHeader from './components/LoginHeader';
import GoogleButton from './components/GoogleButton';
import AdminForm from './components/AdminForm';

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = useLoginMutation('/admin/login', ({ name, role, message }) => {
        localStorage.setItem('userData', JSON.stringify({ name, role }));
        navigate('/admin');
        alert(message);
        setTimeout(() => {
            window.location.reload();
        }, 100);
    }
    );

    const handleProfLogin = useLoginMutation('/profs/login', ({ message, id, name, email, role, branch_tag }) => {
        const existingUserData = JSON.parse(localStorage.getItem('userData')) || {};
        const updatedUserData = {
            id,
            name,
            email,
            role,
            branch_tag,
            ...existingUserData
        };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        alert(message)
        navigate(`/prof/${role}/${branch_tag}`);
        setTimeout(() => {
            window.location.reload();
        }, 100);
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleAdminLogin = (e) => {
        e.preventDefault();
        handleLogin.mutate(formData);
    };

    const handleGoogleLogin = (email) => {
        handleProfLogin.mutate({ email });
    }

    return (
        <div className='flex flex-col justify-center items-center min-h-dvh text-center bg-gradient-to-r from-sky-300 to-indigo-900 overflow-hidden'>
            <div className='border border-solid border-black rounded-lg p-12 bg-white shadow-xl shadow-black w-1/4 min-w-[400px]'>
                <LoginHeader />
                <GoogleButton setFormData={setFormData} form={formData} handleLogin={handleGoogleLogin} />
                <AdminForm formData={formData} onLogin={handleAdminLogin} handleChange={handleChange} />
            </div>
        </div>
    );
}

const useLoginMutation = (loginUrl, onSuccessCallback) => {
    return useMutation(
        async (formData) => {
            const response = await axios.post(loginUrl, formData);
            return response.data;
        },
        {
            onSuccess: onSuccessCallback,
            onError: (error) => {
                console.log('Error:', error);
                if (error.response.data.message) alert(error.response.data.message);
                else alert('Error logging in!');
            },
        }
    );
};
