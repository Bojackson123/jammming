import React from 'react';
import './SearchBar.css';


function SearchBar() {
    return (
        <div className='search'>
            <input className='search-bar' placeholder="Enter A Song, Album, or Artist" />
            <button className="search-button">Search</button>
        </div>
    );
};

export default SearchBar;