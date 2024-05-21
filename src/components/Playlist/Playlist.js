import React from "react";
import "./Playlist.css";
import Track from "../Track/Track";

function Playlist() {
    return (
        <div className='playlist'>
            <h2>Playlist</h2>
            <Track />
            <Track />
            <Track />
        </div>
    );
};

export default Playlist;