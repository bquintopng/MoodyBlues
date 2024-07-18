import React from "react";

const Playlist = ({ songs, onAddPlaylist, onGoBack }) => {
  return (
    <div>
      <h2>Your Playlist:</h2>
      <ul>
        {songs.map((song, index) => (
          <li key={index}>
            {song.name} by {song.artist} <br />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
