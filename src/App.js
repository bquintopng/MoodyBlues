import React, { useState, useEffect } from "react";
import axios from "axios";
import Home from "./components/Home";
import MoodSelect from "./components/MoodSelect";
import Playlist from "./components/Playlist";

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("access_token");
    if (token) {
      setAccessToken(token);
    }
  }, []);

  const handleMoodSelect = async ({ background, face, body }) => {
    const response = await axios.get(`/recommendations`, {
      params: {
        background,
        face,
        body,
        access_token: accessToken,
      },
    });
    setSongs(response.data.songs);
  };

  const handleAddPlaylist = async () => {
    try {
      const trackUris = songs
        .map((song) => `spotify:track:${song.id}`)
        .join(",");
      await axios.get("/create-playlist", {
        params: {
          access_token: accessToken,
          songs: trackUris,
        },
      });
      alert("Playlist added to your profile!");
    } catch (error) {
      console.error("Error adding playlist to profile:", error);
    }
  };

  const handleGoBackHome = () => {
    setSongs([]);
    setAccessToken(null);
  };
  const handleGoBack = () => {
    setSongs([]);
  };

  const handleDesignChange = (design) => {
    localStorage.setItem("selectedDesign", design);
  };

  return (
    <div className="App">
      <h1>Moody Blues</h1>
      {!accessToken && <Home onDesignSelect={handleDesignChange} />}
      {accessToken && !songs.length && (
        <>
          <MoodSelect
            onMoodSelect={handleMoodSelect}
            selectedDesign={localStorage.getItem("selectedDesign")}
          />
          <button onClick={handleGoBackHome}>Return Home</button>
        </>
      )}
      {songs.length > 0 && (
        <>
          <Playlist songs={songs} />
          <button onClick={handleAddPlaylist}>Add Playlist to Profile</button>
          <button onClick={handleGoBack}>Select New Mood</button>
          <button onClick={handleGoBackHome}>Return Home</button>
        </>
      )}
    </div>
  );
};

export default App;
