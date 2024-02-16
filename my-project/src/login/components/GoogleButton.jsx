const clientId = "902199029700-1pv3edc1p4oqe8kj2k77ltqapea1ooa2.apps.googleusercontent.com";

export default function GoogleButton() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        gapi.load("client:auth2", () => {
            gapi.client.init({
                clientId: clientId,
                scope: ''
            }).then(() => {
                console.log('Google API initialized successfully');
            }).catch((error) => {
                console.error('Error initializing Google API:', error);
            });
        });
    }, []);
    
    const handleSuccess = (res) => {
        setProfile(res.profileObj);
    };

    const handleFailure = (res) => {
        alert('Login failure:', res)
    };

    return (
        <div>
            {profile ? (
                <div>
                    <img src={profile.imageUrl} alt="user image" />
                    <h2>Login success</h2>
                    <p>Name: {profile.name}</p>
                    <p>Email: {profile.email}</p>
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
        </div>
    );
};

import { useEffect, useState } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';