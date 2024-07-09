const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const querystring = require("querystring");

dotenv.config();

var app = express();
const port = 3000;

app.use(express.static("build"));

const spotifyAuthEndpoint = "https://accounts.spotify.com/authorize";
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

var redirect_uri = "http://localhost:3000/callback";

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
  var state = generateRandomString(16);
  var scope = "user-read-private user-read-email user-top-read";

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
  var code = req.query.code || null;
  var state = req.query.state || null;

  if (state === null) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    var authOptions = {
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
          new Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    axios
      .post(authOptions.url, authOptions.data, { headers: authOptions.headers })
      .then((response) => {
        const accessToken = response.data.access_token;
        res.redirect(
          "/?" + querystring.stringify({ access_token: accessToken })
        );
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
    // Get user's top tracks or artists
    const topTracksResponse = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const topTracks = topTracksResponse.data.items;
    const seedTracks = topTracks.slice(0, 5).map((track) => track.id); // Use top 5 tracks as seeds

    // Get recommendations based on mood and top tracks
    const recommendationsResponse = await axios.get(
      "https://api.spotify.com/v1/recommendations",
      {
        params: {
          seed_tracks: seedTracks.join(","),
          limit: 5, // Get 5 recommendations
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
        name: track.name,
        artist: track.artists[0].name,
      })
    );

    res.json({ songs: recommendations });
  } catch (error) {
    console.error(
      "Error getting recommendations:",
      error.response ? error.response.data : error.message
    );
    res.status(500).send("Error getting recommendations");
  }
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});
