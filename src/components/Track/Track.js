import React, { useState } from 'react';
import './Track.css';

const track = {
    name: 'Daylilly',
    artist: 'Movements',
    album: 'Feel Something'
};

function Track() {
    const [clicked, setClicked] = useState(false);

    const handleMouseDown = () => {
        setClicked(true);
    };

    const handleMouseUp = () => {
        setClicked(false);
    };

    const handleTouchStart = () => {
        setClicked(true);
    };

    const handleTouchEnd = () => {
        setClicked(false);
    };

    return (
        <div className='track'>
            <div className='track-information'>
                <h3>{track.name}</h3>
                <p>{track.artist} | {track.album}</p>
            </div>
            <button className={`track-add ${clicked ? 'clicked' : ''}`} 
            onMouseDown={handleMouseDown} 
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart} 
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            >
                +
            </button>
        </div>
    );
};

export default Track;
