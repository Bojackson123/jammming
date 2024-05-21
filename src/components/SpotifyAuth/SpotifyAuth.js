import React from 'react';
import spotifyService from '../../spotifyService';
import './SpotifyAuth.css'; // Import the CSS file for styling
import spotifyLogo from '../../Assets/Spotify_Icon_RGB_Green.png';
import spotifyLogoHover from '../../Assets/Spotify_Icon_RGB_Black.png';

function SpotifyAuth() {
    const handleAuth = () => {
        spotifyService.authorize();
    };

    return (
        <button onClick={handleAuth} className="spotify-auth-button">
            <img
                src={spotifyLogo}
                alt="Spotify Logo"
                className="spotify-logo"
            />
            <img
                src={spotifyLogoHover}
                alt="Spotify Logo Hover"
                className="spotify-logo spotify-logo-hover"
            />
            Authorize with Spotify
        </button>
    );
}

export default SpotifyAuth;