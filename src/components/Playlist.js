import React from "react";

const Playlist = ({ songs }) => {
  return (
    <div>
      <h2>Your Playlist:</h2>
      <ul>
        {songs.map((song, index) => (
          <li key={index}>
            {song.name} by {song.artist} <br></br>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
