import React, {useState, useEffect} from 'react';
import './SearchBar.css';
import Tracklist from '../Tracklist/Tracklist';
import Playlist from '../Playlist/Playlist';
import spotifyService from '../../spotifyService';
import SpotifyAuth from '../SpotifyAuth/SpotifyAuth';


function SearchBar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const token = spotifyService.getAccessToken();
        if (token) {
            setIsAuthenticated(true);
            spotifyService.getUserProfile().then(profile => {
                if (profile) {
                    setUserName(profile.display_name);
                }
            });
        }
    }, []);
    return (
        <>
            <div className='spotify-auth'>
                {!isAuthenticated ? (
                    <SpotifyAuth />
                ) : (
                    <div className="welcome-message">
                        Welcome, {userName}!
                    </div>
                )}
            </div>
            <div className='search'>
                <input className='search-bar' placeholder="Enter A Song, Album, or Artist" />
                <button className="search-button">Search</button>
            </div>
            <div className='track-containers'>
                <div className='tracklist'>
                    <Tracklist />
                </div>
                <div className='playlist'>
                    <Playlist />
                    <div className='button'>
                    <button className='playlist-save'>SAVE TO SPOTIFY</button>
                    <button className='playlist-clear'>CLEAR PLAYLIST</button>
                    </div>
                </div>
            </div>
        </>
       
        
    );
};

export default SearchBar;