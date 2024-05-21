import React from "react";
import "./Tracklist.css";
import Track from "../Track/Track";


function Tracklist() {
    return (
        <div className='tracklist'>
            <h2>Results</h2>
            <Track />
            <Track />
            <Track />
        </div>
    );

};

export default Tracklist;