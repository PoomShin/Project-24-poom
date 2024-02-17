export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '', email: '' });
    const loginMutation = useLoginMutation();
    const profLoginMutation = useProfLoginMutation();

    const handleAdminLogin = (e) => {
        e.preventDefault();
        loginMutation.mutate(formData);
    };
    const handleProfLogin = () => {
        profLoginMutation.mutate(formData);
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    return (
        <Container>
            <LoginHeader />
            <GoogleButton setFormData={setFormData} handleLogin={handleProfLogin} />
            <AdminForm formData={formData} handleLogin={handleAdminLogin} handleChange={handleChange} />
        </Container>
    );
};

const Container = ({ children }) => {
    return (
        <div className='flex flex-col justify-center items-center min-h-dvh text-center bg-gradient-to-r from-sky-300 to-indigo-900'>
            <div className='border border-solid border-black rounded-lg p-12 bg-white shadow-xl shadow-black w-1/4'>
                {children}
            </div>
        </div>
    )
}

const useLoginMutation = () => {
    const navigate = useNavigate();

    return useMutation(
        async ({ username, password }) => {
            const response = await axios.post('/admin/login', { username, password });
            return response.data;
        },
        {
            onSuccess: ({ success, message, name, role }) => {
                if (success) {
                    localStorage.setItem('userData', JSON.stringify({ name, role }));
                    navigate('/admin');
                    setTimeout(() => {
                        window.location.reload();
                    }, 100);
                } else alert(message);
            },
            onError: (error) => {
                console.log(error.message);
                alert('incorrect username or password!')
            },
        }
    );
};

const useProfLoginMutation = () => {
    const navigate = useNavigate();

    return useMutation(
        async ({ email }) => {
            const response = await axios.post('/profs/login', { email });
            return response.data;
        },
        {
            onSuccess: ({ success, message, id, name, role, branchtag }) => {
                if (success) {
                    localStorage.setItem('userData', JSON.stringify({ id, name, role, branchtag }));
                    navigate(`/prof/${role}/${branchtag}`);
                    setTimeout(() => {
                        window.location.reload();
                    }, 100);
                } else alert(message);
            },
            onError: (error) => {
                console.log(error.message);
                alert('Error logging in!')
            },
        }
    );
};

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import axios from 'axios';

import LoginHeader from './components/LoginHeader';
import GoogleButton from './components/GoogleButton';
import AdminForm from './components/AdminForm';