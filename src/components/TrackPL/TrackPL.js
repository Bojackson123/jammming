import React, { useState } from 'react';
import './TrackPL.css';

function Track(props) {
    const [clicked, setClicked] = useState(false);
    const onRemoveTrack = props.onRemoveTrack;

    const handleMouseDown = () => {
        setClicked(true);
        onRemoveTrack(props.track);
    };

    const handleMouseUp = () => {
        setClicked(false);
    };

    const handleTouchStart = () => {
        setClicked(true);
        onRemoveTrack(props.track);
    };

    const handleTouchEnd = () => {
        setClicked(false);
    };

    if (!props.track) {
        return null; // Return null if track is undefined
    }

    
    return (
        <div className='track'>
            <div className='track-information'>
                <a href={props.track.songLink} target="_blank" rel="noopener noreferrer"><h3>{props.track.name}</h3></a>
                <div className='artist-album'>
                    <a href={props.track.artistLink} target="_blank" rel="noopener noreferrer">
                        <p>{props.track.artist}</p>
                    </a> 
                    <p>|</p> 
                    <a href={props.track.albumLink} target="_blank" rel="noopener noreferrer">
                        <p>{props.track.album}</p>
                    </a>
                </div>
            </div>
            <button className={`track-add ${clicked ? 'clicked' : ''}`} 
                onMouseDown={handleMouseDown} 
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart} 
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >
                -
            </button>
        </div>
    );
};

export default Track;
