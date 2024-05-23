import React, { useState, useEffect, useRef } from 'react';
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
    const [trackIdCounter, setTrackIdCounter] = useState(0);
    const [searchFilter, setSearchFilter] = useState('track');
    const [suggestions, setSuggestions] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

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
            const results = await spotifyService.search(searchTerm, searchFilter);
            let trackDetails = [];

            if (searchFilter === 'track' && results.tracks && results.tracks.items) {
                trackDetails = results.tracks.items.map(track => ({
                    name: track.name,
                    songLink: track.external_urls.spotify,
                    artist: track.artists[0]?.name || 'Unknown Artist',
                    artistLink: track.artists[0]?.external_urls.spotify || '',
                    album: track.album.name,
                    albumLink: track.album.external_urls.spotify,
                    uri: track.uri
                }));
            } else if (searchFilter === 'artist' && results.artists && results.artists.items) {
                const artistTracksPromises = results.artists.items.map(artist => spotifyService.getArtistTopTracks(artist.id));
                const artistTracksResults = await Promise.all(artistTracksPromises);
                artistTracksResults.forEach(artistTracks => {
                    if (artistTracks) {
                        artistTracks.forEach(track => {
                            trackDetails.push({
                                name: track.name,
                                songLink: track.external_urls.spotify,
                                artist: track.artists[0]?.name || 'Unknown Artist',
                                artistLink: track.artists[0]?.external_urls.spotify || '',
                                album: track.album.name,
                                albumLink: track.album.external_urls.spotify,
                                uri: track.uri
                            });
                        });
                    }
                });
            } else if (searchFilter === 'album' && results.albums && results.albums.items.length > 0) {
                const firstAlbum = results.albums.items[0];
                const albumTracks = await spotifyService.getAlbumTracks(firstAlbum.id);
                if (albumTracks) {
                    trackDetails = albumTracks.map(track => ({
                        name: track.name,
                        songLink: track.external_urls.spotify,
                        artist: track.artists[0]?.name || 'Unknown Artist',
                        artistLink: track.artists[0]?.external_urls.spotify || '',
                        album: firstAlbum.name,
                        albumLink: firstAlbum.external_urls.spotify,
                        uri: track.uri
                    }));
                }
            }

            setTracks(trackDetails);
        } catch (error) {
            console.error('Error performing search:', error);
        }
    };

    const fetchSuggestions = async (query) => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        try {
            const results = await spotifyService.search(query, searchFilter);
            let suggestions = [];
            if (searchFilter === 'track' && results.tracks) {
                suggestions = results.tracks.items.map(track => ({
                    name: track.name,
                    id: track.id,
                    artist: track.artists[0].name,
                    type: 'track'
                }));
            } else if (searchFilter === 'artist' && results.artists) {
                suggestions = results.artists.items.map(artist => ({
                    name: artist.name,
                    id: artist.id,
                    type: 'artist'
                }));
            } else if (searchFilter === 'album' && results.albums) {
                suggestions = results.albums.items.map(album => ({
                    name: album.name,
                    id: album.id,
                    artist: album.artists[0].name,
                    type: 'album'
                }));
            }
            setSuggestions(suggestions);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const handleSuggestionClick = async (suggestion) => {
        setSearchTerm(suggestion.name);
        setSuggestions([]);
    
        if (suggestion.type === 'track') {
            handleSearch(); // Perform search with the selected suggestion
        } else if (suggestion.type === 'artist') {
            try {
                const artistTracks = await spotifyService.getArtistTopTracks(suggestion.id);
                if (artistTracks) {
                    const trackDetails = artistTracks.map(track => ({
                        name: track.name,
                        songLink: track.external_urls.spotify,
                        artist: track.artists[0]?.name || 'Unknown Artist',
                        artistLink: track.artists[0]?.external_urls.spotify || '',
                        album: track.album.name,
                        albumLink: track.album.external_urls.spotify,
                        uri: track.uri
                    }));
                    setTracks(trackDetails);
                }
            } catch (error) {
                console.error('Error fetching artist tracks:', error);
            }
        } else if (suggestion.type === 'album') {
            try {
                const albumTracks = await spotifyService.getAlbumTracks(suggestion.id);
                if (albumTracks) {
                    const trackDetails = albumTracks.map(track => ({
                        name: track.name,
                        songLink: track.external_urls.spotify,
                        artist: track.artists[0]?.name || 'Unknown Artist',
                        artistLink: track.artists[0]?.external_urls.spotify || '',
                        album: suggestion.name,
                        albumLink: suggestion.external_urls?.spotify || '', // Ensure this is handled correctly
                        uri: track.uri
                    }));
                    setTracks(trackDetails);
                }
            } catch (error) {
                console.error('Error fetching album tracks:', error);
            }
        }
    };

    const addTrackToPlaylist = (track) => {
        setTrackIdCounter((prevId) => prevId + 1);
        const trackWithId = { ...track, id: trackIdCounter };
        setPlaylist((prevPlaylist) => [...prevPlaylist, trackWithId]);
    };

    const removeTrackFromPlaylist = (trackId) => {
        setPlaylist((prevPlaylist) => prevPlaylist.filter(track => track.id !== trackId));
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

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        fetchSuggestions(query);
    };

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
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
                <div className='filters'>
                    <p 
                        className={searchFilter === 'track' ? 'active': ''}
                        onClick={() => setSearchFilter('track')}
                    >
                        Songs
                    </p>
                    |
                    <p
                        className={searchFilter === 'artist' ? 'active': ''}
                        onClick={() => setSearchFilter('artist')}
                    >
                        Artists
                    </p>
                    |
                    <p
                        className={searchFilter === 'album' ? 'active': ''}
                        onClick={() => setSearchFilter('album')}
                    >
                        Albums
                    </p>
                </div>
                <input
                    ref={inputRef} 
                    className='search-bar' 
                    placeholder="Enter A Song, Album, or Artist" 
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />

                <ul 
                    id="suggestions"
                    style={{
                        display: isFocused && suggestions.length > 0 ? 'block' : 'none',
                        border: isFocused && suggestions.length > 0 ? '1px solid #ccc' : 'none'
                    }}
                >
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onMouseDown={() => handleSuggestionClick(suggestion)}>
                            {suggestion.name + (suggestion.artist ? ` - ${suggestion.artist}` : '')}
                        </li>
                    ))}
                </ul>
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