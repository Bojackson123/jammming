import React, {useRef} from "react";
import "./Playlist.css";
import TrackPL from "../TrackPL/TrackPL";

function Playlist(props) {
    const inputRef = useRef(null);
    const title = props.title;
    const setTitle = props.onTitleChange;


    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        console.log(event.target.value);
    };

    const handleIconClick = () => {
        inputRef.current.focus();
    };

    return (
        <div className='playlist'>
            <div className="playlist-header">
            <input 
                type="text"
                value={title}
                onChange={handleTitleChange}
                className='playlist-title'
                ref={inputRef}
            />
            <i className="fas fa-edit edit-icon" onClick={handleIconClick}></i>
            </div>
            {props.playList && props.playList.map((track, index) => (
                <TrackPL key={`${track.uri}-${index}`} track={track} onRemoveTrack={() => props.onRemoveTrack(track.id)}/>
            ))}
        </div>
    );
};

export default Playlist;