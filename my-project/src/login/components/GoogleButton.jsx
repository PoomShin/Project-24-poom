const clientId = "902199029700-1pv3edc1p4oqe8kj2k77ltqapea1ooa2.apps.googleusercontent.com";

export default function GoogleButton({ setFormData, handleLogin }) {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const initializeGoogleApi = async () => {
            try {
                await gapi.load("client:auth2");
                await gapi.client.init({
                    clientId: clientId,
                    scope: ''
                });
                console.log('Google API initialized successfully');
            } catch (error) {
                console.error('Error initializing Google API:', error);
            }
        };

        initializeGoogleApi();
    }, []);

    const handleSuccess = (res) => {
        setProfile(res.profileObj);
        setFormData(prevFormData => ({
            ...prevFormData,
            email: res.profileObj.email
        }));
        handleLogin();
    };

    const handleFailure = (res) => {
        if (res.error !== "Cross-Origin-Opener-Policy") {
            console.error('Login failure:', res);
        }
    };

    return (
        <Container>
            {profile ? (
                <div>
                    <GoogleLogout clientId={clientId} buttonText='Log out' onLogoutSuccess={() => setProfile(null)} />
                </div>
            ) : (
                <GoogleLogin
                    clientId={clientId}
                    buttonText='Sign in with Google'
                    onSuccess={handleSuccess}
                    onFailure={handleFailure}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                />
            )}
        </Container>
    );
}

const Container = ({ children }) => {
    return (
        <div className='flex flex-col items-center border border-solid border-black rounded-tl-lg rounded-tr-lg px-12 pt-3 pb-6 bg-emerald-600'>
            <h1 className='font-bold text-white'>For Professor</h1>
            {children}
        </div>
    )
}

const Profile = ({ imageUrl, name, email }) => {
    return (
        <>
            <img src={imageUrl} alt="user image" />
            <h2>Login success</h2>
            <p>Name: {name}</p>
            <p>Email: {email}</p>
        </>
    )
}

import { useEffect, useState } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';
