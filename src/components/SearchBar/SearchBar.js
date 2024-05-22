import React, { useState, useEffect } from 'react';
import './SearchBar.css';
import Tracklist from '../Tracklist/Tracklist';
import Playlist from '../Playlist/Playlist';
import spotifyService from '../../spotifyService';
import SpotifyAuth from '../SpotifyAuth/SpotifyAuth';

function SearchBar() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [tracks, setTracks] = useState([]);
    const [playlist, setPlaylist] = useState([]);
    const [playlistTitle, setPlaylistTitle] = useState('Playlist');

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
                setUserId(profile.id);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
        }
    };

    const handleSearch = async () => {
        try {
            const results = await spotifyService.search(searchTerm);
            console.log(results);
            if (results && results.tracks && results.tracks.items) {
                const trackDetails = results.tracks.items.map(track => ({
                    name: track.name,
                    songLink: track.external_urls.spotify,
                    artist: track.artists[0].name,
                    artistLink: track.artists[0].external_urls.spotify,
                    album: track.album.name,
                    albumLink: track.album.external_urls.spotify,
                    uri: track.uri
                }));
                setTracks(trackDetails);
                console.log(trackDetails);
            }
        } catch (error) {
            console.error('Error performing search:', error);
        }
    };

    const addTrackToPlaylist = (track) => {
        setPlaylist((prevPlaylist) => [...prevPlaylist, track]);
    };

    const removeTrackFromPlaylist = (track) => {
        setPlaylist((prevPlaylist) => prevPlaylist.filter(t => t !== track));
    };

    const savePlaylist = async () => {
        try {
            const playlistName = playlistTitle;
            const playlistId = await spotifyService.createPlaylist(userId, playlistName);
            const trackUris = playlist.map(track => track.uri);
            await spotifyService.addTracksToPlaylist(playlistId, trackUris);
        } catch (error) {
            console.error('Error saving playlist:', error);
        }
    };

    const clearPlaylist = () => {
        setPlaylist([]);
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
                    onChange={(e) => {
                        console.log(e.target.value)
                        setSearchTerm(e.target.value)
                    }}
                />
                <button className="search-button" onClick={handleSearch}>Search</button>
            </div>
            <div className='track-containers'>
                <div className='tracklist'>
                    <Tracklist trackList={tracks} onAddTrack={addTrackToPlaylist}/>
                </div>
                <div className='playlist'>
                    <Playlist playList={playlist} onRemoveTrack={removeTrackFromPlaylist}
                        title={playlistTitle} onTitleChange={setPlaylistTitle}/>
                    <div className='button'>
                        <button className='playlist-save' onClick={savePlaylist}>SAVE TO SPOTIFY</button>
                        <button className='playlist-clear' onClick={clearPlaylist}>CLEAR PLAYLIST</button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SearchBar;