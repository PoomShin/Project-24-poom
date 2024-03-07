import { useState, useEffect } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';

const clientId = "902199029700-1pv3edc1p4oqe8kj2k77ltqapea1ooa2.apps.googleusercontent.com";

export default function GoogleButton({ handleLogin }) {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const initializeGoogleApi = async () => {
            try {
                await new Promise((resolve, reject) => {
                    gapi.load('client:auth2', {
                        callback: resolve,
                        onerror: reject,
                    });
                });
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

    const handleGoogleLoginSuccess = (res) => {
        const { email, imageUrl } = res.profileObj;
        setProfile(res.profileObj);
        localStorage.setItem('userData', JSON.stringify({ imageUrl }));
        handleLogin(email);
    };

    const handleGoogleLoginFailure = (res) => {
        if (res.error !== 'Cross-Origin-Opener-Policy') {
            console.error('Google login failure:', res);
        }
    };

    return (
        <div className='flex flex-col items-center border border-solid rounded-tl-lg rounded-tr-lg border-black bg-emerald-600 px-12 pt-3 pb-6'>
            <h1 className='font-bold text-white'>For Professor</h1>
            {profile ? (
                <GoogleLogout clientId={clientId} buttonText='Log out' onLogoutSuccess={() => setProfile(null)} />
            ) : (
                <GoogleLogin
                    clientId={clientId}
                    buttonText='Sign in with Google'
                    onSuccess={handleGoogleLoginSuccess}
                    onFailure={handleGoogleLoginFailure}
                    isSignedIn={false}
                />
            )}
        </div>
    );
}