export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    {/* เรียกใช้เมื่อ submit form ใน <Admin Form/> */ }
    const { mutate: loginMutation } = useMutation({
        mutationFn: async ({ username, password }) => {
            try {
                const response = await axios.post('http://localhost:5000/admin/login', { username, password });
                return response.data;
            } catch (error) {
                throw new Error(error.response.data.message);
            }
        },
        onSuccess: ({ success, message, name, role }) => {
            if (success) {
                alert(`${message} Your name is ${name} and role is ${role}`);
                localStorage.setItem('userData', JSON.stringify({ name, role }));
                navigate('/admin');
            } else
                alert(message);
        },
        onError: ({ message }) => {
            alert(message);
        },
    });
    const handleLogin = (e) => {
        e.preventDefault();
        loginMutation({ username, password });
    };

    return (
        <div className='flex flex-col justify-center items-center h-screen text-center bg-gradient-to-r from-sky-300 to-indigo-900'>
            <div className='border border-solid border-black rounded-lg p-12 bg-white shadow-xl shadow-black w-1/4'>
                {/* Header */}
                <LoginHeader />

                {/* Login section */}
                <div className='flex flex-col items-center border border-solid border-black rounded-tl-lg rounded-tr-lg px-12 pt-3 pb-6 bg-emerald-600'>
                    <h1 className='font-bold text-white'>For Professor</h1>
                    <GoogleButton />
                </div>
                <div className='flex flex-col items-center border border-solid border-black px-12 py-3 bg-emerald-900'>
                    <h1 className='font-bold text-white'>For Admin</h1>
                    <AdminForm handleLogin={handleLogin} setPassword={setPassword} setUsername={setUsername} />
                </div>
            </div>
        </div>
    );
};

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';

import LoginHeader from './components/LoginHeader';
import GoogleButton from './components/GoogleButton';
import AdminForm from './components/AdminForm';