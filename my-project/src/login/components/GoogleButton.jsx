import React, { useEffect, useState } from 'react';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import { gapi } from 'gapi-script';

const GoogleButton = () => {
    const clientId = "902199029700-1pv3edc1p4oqe8kj2k77ltqapea1ooa2.apps.googleusercontent.com";
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const initClient = () => {
            gapi.client.init({
                clientId: clientId,
                scope: ''
            });
        };

        gapi.load("client:auth2", initClient);
    }, []);

    const success = (res) => {
        console.log('success', res);
        setProfile(res.profileObj); // Assuming profileObj contains user profile information
    };

    const failure = (res) => {
        console.log('failure', res);
    };
    const logout =  () => {
        setProfile(null);
    }
    return (
        <div>
            <br /><br />
            {profile ? (
                <div>
                    <img src = {profile.imageUrl} alt = "user image" />
                    <h2>Login success</h2>
                    {/* Display user profile information here */}
                    <p>Name: {profile.name}</p>
                    <p>Email: {profile.email}</p>
                    <GoogleLogout clientId={clientId} buttonText='Log out'  onLogoutSuccess={logout}/>
                    {/* Add more profile information as needed */}
                </div>
            ) : (
                <GoogleLogin
                    clientId={clientId}
                    buttonText='Sign in with Google'
                    onSuccess={success}
                    onFailure={failure}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                />
            )}
        </div>
    );
};

export default GoogleButton;