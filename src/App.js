import React, { useState, useEffect } from "react";
import axios from "axios";
import LoginButton from "./components/LoginButton";
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

  return (
    <div className="App">
      <h1>Moody Blues</h1>
      {!accessToken && <LoginButton />}
      {accessToken && !songs.length && (
        <MoodSelect onMoodSelect={handleMoodSelect} />
      )}
      {songs.length > 0 && <Playlist songs={songs} />}
    </div>
  );
};

export default App;
