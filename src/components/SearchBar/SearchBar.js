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
                <Tracklist className="tracklist"/>
                <Playlist className="playlist"/>
            </div>
        </>
       
        
    );
};

export default SearchBar;