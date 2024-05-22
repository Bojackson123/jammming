import React from "react";
import "./Tracklist.css";
import Track from "../Track/Track";

function Tracklist(props) {
    return (
        <div className='tracklist'>
            <p className="results">Results</p>
            {props.trackList && props.trackList.map(track => (
                <Track key={track.uri} track={track} onAddTrack={props.onAddTrack}/>
            ))}
        </div>
    );
};

export default Tracklist;

