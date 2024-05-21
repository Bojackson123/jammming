import React from 'react';
import './SearchBar.css';
import Tracklist from '../Tracklist/Tracklist';
import Playlist from '../Playlist/Playlist';


function SearchBar() {
    return (
        <>
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
                    </div>
                </div>
            </div>
        </>
       
        
    );
};

export default SearchBar;