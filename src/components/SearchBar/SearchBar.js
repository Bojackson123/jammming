import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import Tracklist from '../Tracklist/Tracklist';
import Playlist from '../Playlist/Playlist';
import spotifyService from '../../spotifyService';
import SpotifyAuth from '../SpotifyAuth/SpotifyAuth';

function SearchBar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const token = spotifyService.getAccessToken();
        if (token) {
            setIsAuthenticated(true);
            fetchUserProfile();
        }
    }, []);

    const fetchUserProfile = async () => {
        try {
            const profile = await spotifyService.getUserProfile();
            if (profile) {
                setUserName(profile.display_name);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleSearch = async () => {
        try {
            const results = await spotifyService.search(searchTerm);
            console.log(results);
            // Handle search results here
        } catch (error) {
            console.error('Error performing search:', error);
        }
    };

    return (
        <>
            <div className='spotify-auth'>
                {!isAuthenticated || !userName ? (
                    <SpotifyAuth />
                ) : (
                    <div className="welcome-message">
                        Welcome, {userName}!
                    </div>
                )}
            </div>
            <div className='search'>
                <input 
                    className='search-bar' 
                    placeholder="Enter A Song, Album, or Artist" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-button" onClick={handleSearch}>Search</button>
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
}

export default SearchBar;