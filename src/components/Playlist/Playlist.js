import React, {useState, useRef} from "react";
import "./Playlist.css";
import Track from "../Track/Track";

function Playlist() {
    const [title, setTitle] = useState("Playlist");
    const inputRef = useRef(null);

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
            <Track />
            <Track />
            <Track />
            <Track />
            <Track />
            <Track />
            <Track />
            <Track />
            <Track />
            <Track />
            <Track />
        </div>
    );
};

export default Playlist;