import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//API
import useLoginMutation from '../api/Login_API';
//Components
import LoginHeader from './components/LoginHeader';
import GoogleButton from './components/GoogleButton';
import AdminForm from './components/AdminForm';

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const navigate = useNavigate();

    const handleAdminLogin = useLoginMutation('/login/admin', ({ name, role, message }) => {
        localStorage.setItem('userData', JSON.stringify({ name, role }));
        navigate('/admin');
        alert(message);
    });
    const handleProfLogin = useLoginMutation('/login/profs', ({ message, id, name, email, role, branch_tag }) => {
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
        alert(message);
        navigate(`/prof/${role}/${branch_tag}`);
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleAdminLoginFormSubmit = (e) => {
        e.preventDefault();
        handleAdminLogin.mutate(formData);
    };
    const handleGoogleLogin = (email) => {
        handleProfLogin.mutate({ email });
    };

    return (
        <div className='flex flex-col justify-center items-center min-h-dvh text-center bg-gradient-to-r from-sky-300 to-indigo-900 overflow-hidden'>
            <div className='border border-solid border-black rounded-lg p-12 bg-white shadow-xl shadow-black w-1/4 min-w-[400px]'>
                <LoginHeader />
                <GoogleButton setFormData={setFormData} form={formData} handleLogin={handleGoogleLogin} />
                <AdminForm formData={formData} onLogin={handleAdminLoginFormSubmit} handleChange={handleChange} />
            </div>
        </div>
    );
}