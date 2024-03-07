import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
//Context
import { useUserContext } from '../context/User-Context';
//API
import useLoginMutation from '../api/Login_API';
//Components
import LoginHeader from './components/LoginHeader';
import GoogleButton from './components/GoogleButton';
import AdminForm from './components/AdminForm';

export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const { setUserContextValues } = useUserContext();
    const navigate = useNavigate();

    const handleAdminLogin = useLoginMutation('/login/admin', ({ name, role, message }) => {
        const userData = { name, role };
        setUserContextValues(userData); // Update user context
        navigate('/admin');
        alert(message);
    });
    const handleProfLogin = useLoginMutation('/login/profs', ({ message, id, name, email, role, branch_tag }) => {
        const userData = { id, name, email, role, branch_tag };
        setUserContextValues(prev => ({
            ...prev,
            ...userData
        }));
        navigate(`/prof/${role}/${branch_tag}`);
        alert(message);
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    const handleAdminLoginFormSubmit = (e) => {
        e.preventDefault();
        handleAdminLogin.mutate(formData);
    };
    const handleGoogleLogin = (email, imageUrl) => {
        handleProfLogin.mutate({ email });
        setUserContextValues({ imageUrl: imageUrl });
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