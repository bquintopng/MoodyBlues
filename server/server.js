const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const querystring = require("querystring");

dotenv.config();

const app = express();
const port = 3000;

app.use(express.static("build"));

const spotifyAuthEndpoint = "https://accounts.spotify.com/authorize";
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = "http://localhost:3000/callback";

function generateRandomString(length) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

app.get("/login", function (req, res) {
  const state = generateRandomString(16);
  const scope = "user-read-private user-read-email user-top-read playlist-modify-public";

  res.redirect(
    spotifyAuthEndpoint +
      "?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get("/callback", function (req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;

  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    const authOptions = {
      url: "https://accounts.spotify.com/api/token",
      data: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    axios
      .post(authOptions.url, querystring.stringify(authOptions.data), { headers: authOptions.headers })
      .then((response) => {
        const accessToken = response.data.access_token;
        res.redirect("/?" + querystring.stringify({ access_token: accessToken }));
      })
      .catch((error) => {
        console.error("Error getting Spotify access token:", error);
        res.send("Error getting Spotify access token");
      });
  }
});

app.get("/recommendations", async (req, res) => {
  const { background, face, body, access_token: accessToken } = req.query;

  if (!accessToken) {
    return res.status(400).send("Access token is missing");
  }

  try {
    const topTracksResponse = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const topTracks = topTracksResponse.data.items;
    const seedTracks = topTracks.slice(0, 5).map((track) => track.id);

    const recommendationsResponse = await axios.get(
      "https://api.spotify.com/v1/recommendations",
      {
        params: {
          seed_tracks: seedTracks.join(","),
          limit: 10,
          target_energy:
            face === "energetic" ? 0.8 : face === "relaxed" ? 0.2 : 0.5,
          target_valence: face === "happy" ? 0.9 : face === "sad" ? 0.1 : 0.5,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const recommendations = recommendationsResponse.data.tracks.map(
      (track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
      })
    );

    res.json({ songs: recommendations });
  } catch (error) {
    console.error("Error getting recommendations:", error.response ? error.response.data : error.message);
    res.status(500).send("Error getting recommendations");
  }
});

app.get("/create-playlist", async (req, res) => {
  const { access_token: accessToken, songs } = req.query;

  if (!accessToken || !songs) {
    return res.status(400).send("Access token or songs list is missing");
  }

  try {
    const userResponse = await axios.get("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const userId = userResponse.data.id;

    const createPlaylistResponse = await axios.post(
      `https://api.spotify.com/v1/users/${userId}/playlists`,
      {
        name: "Mood Playlist",
        description: "Playlist based on your mood",
        public: true,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const playlistId = createPlaylistResponse.data.id;

    await axios.post(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        uris: songs.split(","),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.send("Playlist created and tracks added successfully");
  } catch (error) {
    console.error("Error creating playlist:", error);
    res.status(500).send("Error creating playlist");
  }
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
