import React, { useState, useEffect } from "react";
import axios from "axios";
import Home from "./components/Home";
import MoodSelect from "./components/MoodSelect";
import Playlist from "./components/Playlist";

// Utility function to generate a random string
function generateRandomString(length) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Utility function to generate code_challenge
async function generateCodeChallenge(codeVerifier) {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

// Utility function to exchange code for access token
const getToken = async (code) => {
  let codeVerifier = localStorage.getItem('code_verifier');
  const clientId = "0de8abb01227441488257a873f13296a";
  const redirectUri = "http://localhost:3000/";

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  };

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", payload);
    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    return data.access_token;
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    throw error;
  }
};

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [songs, setSongs] = useState([]);
  const [selectedDesign, setSelectedDesign] = useState(localStorage.getItem("selectedDesign") || "");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      // Call the getToken function to exchange the code for an access token
      getToken(code).then((token) => {
        setAccessToken(token);
        localStorage.removeItem("code_verifier"); // Optionally, remove code_verifier after use
      }).catch((error) => {
        console.error("Error during token exchange:", error);
      });
    }
  }, []);

  const handleLogin = async () => {
    const codeVerifier = generateRandomString(128);
    const state = generateRandomString(16); 
    localStorage.setItem("code_verifier", codeVerifier);
    localStorage.setItem("state", state); // Store state parameter

    const codeChallenge = await generateCodeChallenge(codeVerifier);
  
    const clientId = "0de8abb01227441488257a873f13296a";
    const redirectUri = "http://localhost:3000/";

    const scope = "user-read-private user-read-email user-top-read playlist-modify-public";
  
    const url = `https://accounts.spotify.com/authorize?` +
                `response_type=code&` +
                `client_id=${encodeURIComponent(clientId)}&` +
                `redirect_uri=${encodeURIComponent(redirectUri)}&` +
                `code_challenge_method=S256&` +
                `code_challenge=${encodeURIComponent(codeChallenge)}&` +
                `scope=${encodeURIComponent(scope)}`;
  
    window.location.href = url;
  };

  const handleMoodSelect = async ({ background, face, body, block1, block2, block3, block4, selectedDesign }) => {
    console.log("handleMoodSelect called with:", { background, face, body, block1, block2, block3, block4, selectedDesign });
    let response;
    if (selectedDesign === "A") {
      response = await axios.get(`/recommendations`, {
        params: {
          background,
          face,
          body,
          access_token: accessToken,
        },
      });
    } else if (selectedDesign === "B") {
      response = await axios.get(`/recommendations`, {
        params: {
          block1,
          block2,
          block3,
          block4,
          access_token: accessToken,
        },
      });
    }
    setSongs(response.data.songs);
  };

  const handleAddPlaylist = async () => {
    try {
      const trackUris = songs.map((song) => `spotify:track:${song.id}`).join(",");
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
    localStorage.removeItem("selectedDesign"); // Clear item from local storage
  };

  const handleGoBack = () => {
    setSongs([]);
  };

  const handleDesignChange = (design) => {
    console.log("Selected Design in App:", design);
    setSelectedDesign(design);
  };

  return (
    <div className="App">
      <h1>Moody Blues</h1>
      {!accessToken && (
        <div>
          <Home onDesignSelect={handleDesignChange} />
          <button onClick={handleLogin}>Login with Spotify</button>
        </div>
      )}
      {accessToken && !songs.length && (
        <>
          <MoodSelect onMoodSelect={handleMoodSelect} selectedDesign={selectedDesign} />
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
