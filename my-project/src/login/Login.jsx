import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';

import LoginHeader from './components/LoginHeader';
import GoogleButton from './components/GoogleButton';
import AdminForm from './components/AdminForm';

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '', email: '' });
    const navigate = useNavigate();

    const handleLogin = useLoginMutation('/admin/login', ({ success, message, name, role }) => {
        if (success) {
            localStorage.setItem('userData', JSON.stringify({ name, role }));
            navigate('/admin');
            setTimeout(() => {
                window.location.reload();
            }, 100);
        } else alert(message);
    });
    const handleProfLogin = useLoginMutation('/profs/login', ({ success, message, id, name, email, role, branch_tag }) => {
        if (success) {
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
            navigate(`/prof/${role}/${branch_tag}`);
            setTimeout(() => {
                window.location.reload();
            }, 100);
        } else alert(message);
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleAdminLogin = (e) => {
        e.preventDefault();
        handleLogin.mutate(formData);
    };
    const handleGoogleLogin = () => {
        handleProfLogin.mutate(formData);
    }

    return (
        <div className='flex flex-col justify-center items-center min-h-dvh text-center bg-gradient-to-r from-sky-300 to-indigo-900'>
            <div className='border border-solid border-black rounded-lg p-12 bg-white shadow-xl shadow-black w-1/4'>
                <LoginHeader />
                <GoogleButton setFormData={setFormData} handleLogin={handleGoogleLogin} />
                <AdminForm formData={formData} onLogin={handleAdminLogin} handleChange={handleChange} />
            </div>
        </div>
    );
};

const useLoginMutation = (loginUrl, onSuccessCallback) => {
    return useMutation(
        async (formData) => {
            const response = await axios.post(loginUrl, formData);
            return response.data;
        },
        {
            onSuccess: onSuccessCallback,
            onError: (error) => {
                console.log(error.message);
                alert('Error logging in!');
            },
        }
    );
};