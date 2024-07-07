const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = 3001;

app.use(express.static('build'));

const redirectUri = 'http://localhost:3001/callback';
const spotifyAuthEndpoint = 'https://accounts.spotify.com/authorize';
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const scopes = ['user-read-private', 'playlist-modify-private'];

app.get('/login', (req, res) => {
  const authUrl = `${spotifyAuthEndpoint}?response_type=code&client_id=${clientId}&scope=${scopes.join(' ')}&redirect_uri=${redirectUri}`;
  res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', null, {
      params: {
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = response.data.access_token;
    res.redirect(`/?access_token=${accessToken}`);
  } catch (error) {
    console.error('Error getting Spotify access token', error);
    res.send('Error getting Spotify access token');
  }
});

app.get('/playlist', async (req, res) => {
  const mood = req.query.mood;
  const accessToken = req.query.access_token;

  // Implement logic to get a playlist based on the mood
  const songs = [
    { name: 'Song 1', artist: 'Artist 1' },
    { name: 'Song 2', artist: 'Artist 2' },
    { name: 'Song 3', artist: 'Artist 3' },
    { name: 'Song 4', artist: 'Artist 4' },
    { name: 'Song 5', artist: 'Artist 5' }
  ];

  res.json({ songs });
});

app.listen(port, () => {
  console.log(`App running at http://localhost:${port}`);
});