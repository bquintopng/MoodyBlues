const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const querystring = require("querystring");

dotenv.config();

const app = express();
const port = 3000;

app.use(express.static("build"));

app.get("/recommendations", async (req, res) => {
  const { background, face, body, block1, block2, block3, block4, access_token: accessToken } = req.query;
  console.log("Recommendations endpoint called with:", req.query);

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
    // could still use these two parameters to find songs
    // target_speechiness:
    // target_instrumentalness:

    let params = {
      seed_tracks: seedTracks.join(","),
      limit: 10,
    };
    if (background && face && body) {
      params = {
        ...params,
        target_energy: face === "Energetic" ? 0.8 : face === "Relaxed" ? 0.2 : 0.5,
        target_valence: face === "Happy" ? 0.9 : face === "Sad" ? 0.1 : 0.5,
        target_danceability: background === "Party" ? 0.9 : background === "Park" ? 0.3 : 0.5,
        target_liveness: body === "Dancing" ? 0.8 : body === "Sitting" ? 0.2 : 0.5,
        target_loudness: background === "Gym" ? 0.7 : background === "City" ? 0.3 : 0.5,
        target_acousticness: body === "Standing" ? 0.6 : body === "Running" ? 0.3 : 0.5,
      };
    } else if (block1 || block2 || block3 || block4) {
      const moodsSet = new Set([block1, block2, block3, block4]);

      let totalParams = {
        target_energy: 0,
        target_valence: 0,
        target_danceability: 0,
        target_loudness: 0,
        target_acousticness: 0,
        target_liveness: 0,
        target_tempo: 0,
      };
      
      let totalParamsCounter = {
        target_energy: 0,
        target_valence: 0,
        target_danceability: 0,
        target_loudness: 0,
        target_acousticness: 0,
        target_liveness: 0,
        target_tempo: 0,
      };

      const moodParams = {
        Happy: { target_energy: 0.8, target_valence: 0.8 },
        Joyful: { target_danceability: 0.6 },
        Excited: { target_valence: 0.7 },
        Content: { target_loudness: 0.5 },
        Sad: { target_valence: 0.2, target_energy: 0.3 },
        Angry: { target_energy: 0.9, target_loudness: 0.8 },
        Anxious: { target_tempo: 130, target_energy: 0.7 },
        Relaxed: { target_valence: 0.6, target_energy: 0.2 },
        Energetic: { target_energy: 0.9, target_tempo: 140 },
        Bored: {target_valence: 0.3},
        Frustrated: {target_energy: 0.8, target_valence: 0.3},
        Nervous: {target_danceability: 0.3},
        Calm: {target_energy: 0.3},
        Depressed: {target_energy: 0.2, target_valence: 0.2},
        Cheerful: {target_valence: 0.9, target_danceability: 0.6},
        Irritated: {target_energy: 0.7, target_loudness: 0.6},
        // Add other moods and their corresponding parameters here
      };

      // Accumulate values from the mood set
      moodsSet.forEach(mood => {
        if (moodParams[mood]) {
          const params = moodParams[mood];
          for (let key in params) {
            if (totalParams.hasOwnProperty(key)) {
              totalParams[key] += params[key];
              totalParamsCounter[key]++;
            }
          }
        }
      });

      // Calculate averages
      const averageParams = {};
      for (let key in totalParams) {
        if (totalParamsCounter[key] > 0) {
          averageParams[key] = totalParams[key] / totalParamsCounter[key];
        }
      }

      console.log(averageParams);

      // Merge average mood parameters with the existing params
      params = { ...params, ...averageParams };
    } else {
      return res.status(400).send("Invalid parameters");
    }
    console.log("parameters for song selection API call", params);

    const recommendationsResponse = await axios.get(
      "https://api.spotify.com/v1/recommendations",
      {
        params,
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
    console.error(
      "Error getting recommendations:",
      error.response ? error.response.data : error.message
    );
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
